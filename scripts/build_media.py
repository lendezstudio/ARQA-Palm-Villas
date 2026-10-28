"""Build optimized media derivatives for the ARQA site.

Reads media/catalog.json, finds each original in ../Initial Assets (never modified),
writes derivatives to public/media/ and the typed data file src/data/media.json.

Photos: AVIF, WebP and JPEG at widths up to (never above) the original width.
Videos: the original MP4 is copied byte-for-byte (already H.264 + AAC, faststart),
so the audio track is preserved exactly. Posters are real frames from each clip.
The hero loop is a short muted derivative for the background only.
"""
import json
import shutil
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parent.parent
ORIGINALS = ROOT.parent / "Initial Assets"
OUT = ROOT / "public" / "media"
DATA = ROOT / "src" / "data" / "media.json"
INVENTORY = ROOT / "media" / "inventory.json"
# Fields kept out of the public bundle.
PRIVATE = {"reason", "people", "villa_evidence", "approval", "original_file", "public"}
WIDTHS = [480, 800, 1200, 1600, 2048]


def find_original(key: str, ext: str) -> Path:
    matches = sorted(ORIGINALS.glob(f"{key}*{ext}"))
    if len(matches) != 1:
        sys.exit(f"Expected one original for {key}, found {len(matches)}")
    return matches[0]


def save_variants(im: Image.Image, stem: str, widths: list[int]) -> list[int]:
    made = []
    for w in widths:
        h = round(im.height * w / im.width)
        r = im.resize((w, h), Image.LANCZOS) if w != im.width else im
        r.save(OUT / "photos" / f"{stem}-{w}.avif", quality=58)
        r.save(OUT / "photos" / f"{stem}-{w}.webp", quality=80, method=6)
        r.save(OUT / "photos" / f"{stem}-{w}.jpg", quality=82, optimize=True, progressive=True)
        made.append(w)
    return made


def build_logo(im: Image.Image) -> dict:
    """Trim the surrounding white and turn the white background transparent.

    Alpha is recovered by "unmultiplying" white, so the gold artwork keeps its
    exact colour and soft edges; nothing in the artwork is redrawn.
    """
    gray = ImageOps.invert(im.convert("L")).point(lambda v: 255 if v > 12 else 0)
    l, t, r, b = gray.getbbox()
    pad = 24
    crop = im.crop((max(l - pad, 0), max(t - pad, 0), min(r + pad, im.width), min(b + pad, im.height)))
    px = crop.load()
    out = Image.new("RGBA", crop.size)
    po = out.load()
    for y in range(crop.height):
        for x in range(crop.width):
            rr, gg, bb = px[x, y]
            a = max(255 - rr, 255 - gg, 255 - bb)
            if a < 6:
                po[x, y] = (0, 0, 0, 0)
                continue
            f = 255 / a
            po[x, y] = tuple(max(0, min(255, round(255 - (255 - c) * f))) for c in (rr, gg, bb)) + (a,)
    out.save(OUT / "brand" / "arqa-logo.png", optimize=True)
    out.save(OUT / "brand" / "arqa-logo.webp", quality=92, exact=True)
    # Favicon: the leaf mark only, on a transparent background.
    # The leaf is the first block of non-empty rows; it ends at the gap above the wordmark.
    alpha = out.getchannel("A")
    rows = [alpha.crop((0, y, out.width, y + 1)).getbbox() is not None for y in range(out.height)]
    top = rows.index(True)
    end = next(y for y in range(top, out.height) if not any(rows[y:y + 8]))
    leaf = out.crop((0, top, out.width, end))
    leaf = leaf.crop(leaf.getbbox())
    icon = ImageOps.pad(leaf, (192, 192), color=(0, 0, 0, 0))
    icon.save(OUT / "brand" / "icon-192.png", optimize=True)
    return dict(optimized_file="media/brand/arqa-logo.webp", trimmed_width=crop.width, trimmed_height=crop.height)


def build_photo(p: dict) -> dict:
    src = find_original(p["file"], ".jpg")
    im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
    entry = {k: v for k, v in p.items() if k != "file"}
    entry.update(
        original_file=f"Initial Assets/{src.name}",
        width=im.width,
        height=im.height,
        villa_id=None,
    )
    if not p["public"]:
        entry["variants"] = []
        return entry

    if p["role"] == "brand-logo":
        entry.update(build_logo(im), variants=[])
        return entry

    widths = [w for w in WIDTHS if w < im.width] + [im.width]
    widths = sorted(set(w for w in widths if w <= 2048))
    entry["variants"] = save_variants(im, p["id"], widths)
    entry["optimized_file"] = f"media/photos/{p['id']}-{widths[-1]}.jpg"

    if p["role"] == "hero":
        og = ImageOps.fit(im, (1200, 630), centering=tuple(p["focal"]))
        og.save(OUT / "og-image.jpg", quality=84, optimize=True)
    return entry


def ffprobe(path: Path) -> dict:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries",
         "format=duration:stream=codec_type,codec_name,width,height,channels,sample_rate",
         "-of", "json", str(path)], capture_output=True, text=True, check=True)
    return json.loads(out.stdout)


def build_video(v: dict) -> dict:
    src = find_original(v["file"], ".mp4")
    info = ffprobe(src)
    vs = next(s for s in info["streams"] if s["codec_type"] == "video")
    aud = next((s for s in info["streams"] if s["codec_type"] == "audio"), None)
    entry = {k: v2 for k, v2 in v.items() if k != "file"}
    entry.update(
        original_file=f"Initial Assets/{src.name}",
        width=vs["width"], height=vs["height"],
        orientation="portrait" if vs["height"] > vs["width"] else "landscape",
        duration=round(float(info["format"]["duration"]), 1),
        video_codec=vs["codec_name"],
        audio_track=({"codec": aud["codec_name"], "channels": aud["channels"], "sample_rate": int(aud["sample_rate"])} if aud else None),
        # Only set in the catalog when the file itself names the villa (e.g. an on-screen title card).
        villa_id=v.get("villa_id"),
        captions=None,
    )
    if not v["public"]:
        return entry

    dest = OUT / "video" / f"{v['id']}.mp4"
    shutil.copyfile(src, dest)
    entry["optimized_file"] = f"media/video/{v['id']}.mp4"

    frame = OUT / "video" / f"{v['id']}-frame.png"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(v["poster_at"]), "-i", str(src),
                    "-frames:v", "1", str(frame)], check=True)
    im = Image.open(frame).convert("RGB")
    im.save(OUT / "video" / f"{v['id']}-poster.webp", quality=80)
    im.save(OUT / "video" / f"{v['id']}-poster.jpg", quality=82, optimize=True)
    thumb = ImageOps.fit(im, (720, 540), centering=(0.5, 0.42))
    thumb.save(OUT / "video" / f"{v['id']}-thumb.webp", quality=80)
    thumb.save(OUT / "video" / f"{v['id']}-thumb.jpg", quality=82, optimize=True)
    frame.unlink()
    entry["poster"] = f"media/video/{v['id']}-poster"
    if v["role"] == "hero":
        # Soft, darkened backdrop shown either side of the portrait clip on wide screens.
        small = im.resize((90, 160)).filter(ImageFilter.GaussianBlur(6)).resize((360, 640))
        small.save(OUT / "video" / f"{v['id']}-backdrop.jpg", quality=70)
        entry["backdrop"] = f"media/video/{v['id']}-backdrop.jpg"
    entry["thumb"] = f"media/video/{v['id']}-thumb"

    if "hero_loop" in v:
        # Segments chosen to avoid people and title cards; joined into one muted loop.
        segs = v["hero_loop"]
        trims = "".join(f"[0:v]trim={a}:{b},setpts=PTS-STARTPTS[s{i}];" for i, (a, b) in enumerate(segs))
        graph = trims + "".join(f"[s{i}]" for i in range(len(segs))) + f"concat=n={len(segs)}:v=1:a=0[out]"
        loop = OUT / "video" / f"{v['id']}-hero-loop.mp4"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(src), "-filter_complex", graph, "-map", "[out]",
                        "-an", "-c:v", "libx264", "-profile:v", "high", "-crf", "26", "-preset", "slow",
                        "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(loop)], check=True)
        entry["hero_loop_file"] = f"media/video/{v['id']}-hero-loop.mp4"
    return entry


def main() -> None:
    catalog = json.loads((ROOT / "media" / "catalog.json").read_text(encoding="utf8"))
    for sub in ("photos", "video", "brand"):
        (OUT / sub).mkdir(parents=True, exist_ok=True)
    if "--videos-only" in sys.argv and INVENTORY.exists():
        photos = json.loads(INVENTORY.read_text(encoding="utf8"))["photos"]
        logo = next(p for p in catalog["photos"] if p["role"] == "brand-logo")
        build_logo(ImageOps.exif_transpose(Image.open(find_original(logo["file"], ".jpg"))).convert("RGB"))
    else:
        photos = [build_photo(p) for p in catalog["photos"]]
    # Remove derivatives of clips that are no longer public.
    for v in catalog["videos"]:
        if not v["public"]:
            for f in (OUT / "video").glob(f"{v['id']}*"):
                f.unlink()
    videos = [build_video(v) for v in catalog["videos"]]
    # Full inventory (including exclusions and their reasons) stays internal;
    # only public records are bundled into the site.
    INVENTORY.write_text(json.dumps({"photos": photos, "videos": videos}, indent=2, ensure_ascii=False), encoding="utf8")
    public = {
        "photos": [{k: v for k, v in p.items() if k not in PRIVATE} for p in photos if p["public"]],
        "videos": [{k: v for k, v in x.items() if k not in PRIVATE} for x in videos if x["public"]],
    }
    DATA.parent.mkdir(parents=True, exist_ok=True)
    DATA.write_text(json.dumps(public, indent=2, ensure_ascii=False), encoding="utf8")
    print(f"{sum(p['public'] for p in photos)} public photos, {sum(v['public'] for v in videos)} public videos")


if __name__ == "__main__":
    main()
