import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { inquiry, villas } from '../data/content';
import { contacts } from '../data/contacts';
import {
  buildInquiryMessage,
  emptyInquiry,
  mailtoHref,
  validateInquiry,
  type InquiryErrors,
  type InquiryFields,
} from '../lib/inquiry';
import type { InquiryPreset } from '../lib/ui';
import { Dialog } from './Dialog';
import { Icon } from './Icon';

interface InquiryPanelProps {
  open: boolean;
  preset: InquiryPreset | null;
  onClose: () => void;
}

type CopyState = 'idle' | 'copied' | 'failed';

/**
 * Prepares a readable inquiry the visitor sends themselves. Nothing is
 * submitted, stored or tracked; no reservation or "sent" state is shown.
 */
export function InquiryPanel({ open, preset, onClose }: InquiryPanelProps) {
  const uid = useId();
  const [fields, setFields] = useState<InquiryFields>(emptyInquiry);
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [copy, setCopy] = useState<CopyState>('idle');
  const formRef = useRef<HTMLFormElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!open || !preset) return;
    setMessage(null);
    setFields((f) => ({
      ...f,
      villa: preset.villa ?? f.villa,
      message: preset.message && !f.message.includes(preset.message) ? [f.message, preset.message].filter(Boolean).join('\n') : f.message,
    }));
  }, [open, preset]);

  const today = new Date();
  const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const set = (key: keyof InquiryFields) => (e: { target: { value: string } }) => {
    setFields((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const found = validateInquiry(fields);
    setErrors(found);
    const firstKey = (Object.keys(found) as (keyof InquiryFields)[])[0];
    if (firstKey) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstKey}"]`)?.focus();
      return;
    }
    setMessage(buildInquiryMessage(fields));
    setCopy('idle');
    requestAnimationFrame(() => headingRef.current?.focus());
  };

  const copyMessage = async () => {
    if (!message) return;
    try {
      await navigator.clipboard.writeText(message);
      setCopy('copied');
    } catch {
      setCopy('failed');
      textRef.current?.focus();
      textRef.current?.select();
    }
  };

  const fieldId = (k: string) => `${uid}-${k}`;
  const errorId = (k: keyof InquiryFields) => (errors[k] ? `${fieldId(k)}-error` : undefined);
  const describe = (k: keyof InquiryFields, extra?: string) => [extra, errorId(k)].filter(Boolean).join(' ') || undefined;
  const Err = ({ k }: { k: keyof InquiryFields }) =>
    errors[k] ? (
      <p className="field__error" id={`${fieldId(k)}-error`}>
        {errors[k]}
      </p>
    ) : null;

  return (
    <Dialog open={open} onClose={onClose} label="Check availability" className="drawer">
      <div className="drawer__inner">
        <div className="drawer__top">
          <p className="eyebrow">{inquiry.eyebrow}</p>
          <button type="button" className="icon-text-btn" onClick={onClose} aria-label="Close inquiry">
            <Icon name="close" />
            <span>Close</span>
          </button>
        </div>

        {message === null ? (
          <form ref={formRef} className="inquiry" onSubmit={submit} noValidate>
            <h2 className="heading">{inquiry.heading}</h2>
            <p className="drawer__body">{inquiry.body}</p>

            <div className="field">
              <label htmlFor={fieldId('villa')}>{inquiry.labels.villa}</label>
              <select id={fieldId('villa')} name="villa" value={fields.villa} onChange={set('villa')} data-autofocus>
                <option>{inquiry.helpChoose}</option>
                {villas.names.map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor={fieldId('checkIn')}>{inquiry.labels.checkIn}</label>
                <input
                  id={fieldId('checkIn')}
                  name="checkIn"
                  type="date"
                  min={minDate}
                  value={fields.checkIn}
                  onChange={set('checkIn')}
                  aria-invalid={Boolean(errors.checkIn)}
                  aria-describedby={describe('checkIn')}
                  required
                />
                <Err k="checkIn" />
              </div>
              <div className="field">
                <label htmlFor={fieldId('checkOut')}>{inquiry.labels.checkOut}</label>
                <input
                  id={fieldId('checkOut')}
                  name="checkOut"
                  type="date"
                  min={fields.checkIn || minDate}
                  value={fields.checkOut}
                  onChange={set('checkOut')}
                  aria-invalid={Boolean(errors.checkOut)}
                  aria-describedby={describe('checkOut')}
                  required
                />
                <Err k="checkOut" />
              </div>
            </div>

            <fieldset className="field-group">
              <legend className="visually-hidden">Guests</legend>
              <div className="field-row">
                <div className="field">
                  <label htmlFor={fieldId('adults')}>{inquiry.labels.adults}</label>
                  <input
                    id={fieldId('adults')}
                    name="adults"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    value={fields.adults}
                    onChange={set('adults')}
                    aria-invalid={Boolean(errors.adults)}
                    aria-describedby={describe('adults', `${uid}-guest-help`)}
                    required
                  />
                  <Err k="adults" />
                </div>
                <div className="field">
                  <label htmlFor={fieldId('children')}>{inquiry.labels.children}</label>
                  <input
                    id={fieldId('children')}
                    name="children"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    value={fields.children}
                    onChange={set('children')}
                    aria-invalid={Boolean(errors.children)}
                    aria-describedby={describe('children', `${uid}-guest-help`)}
                  />
                  <Err k="children" />
                </div>
              </div>
              <p className="field__help" id={`${uid}-guest-help`}>{inquiry.guestHelper}</p>
            </fieldset>

            <div className="field">
              <label htmlFor={fieldId('name')}>{inquiry.labels.name}</label>
              <input id={fieldId('name')} name="name" type="text" autoComplete="name" value={fields.name} onChange={set('name')} />
            </div>
            <div className="field">
              <label htmlFor={fieldId('contact')}>{inquiry.labels.contact}</label>
              <input id={fieldId('contact')} name="contact" type="text" autoComplete="email" value={fields.contact} onChange={set('contact')} />
            </div>
            <div className="field">
              <label htmlFor={fieldId('message')}>{inquiry.labels.message}</label>
              <textarea
                id={fieldId('message')}
                name="message"
                rows={4}
                placeholder={inquiry.messagePlaceholder}
                value={fields.message}
                onChange={set('message')}
              />
            </div>

            <button type="submit" className="btn btn--solid btn--block">
              {inquiry.submit}
            </button>
            <p className="field__help">{inquiry.privacy}</p>
          </form>
        ) : (
          <div className="prepared">
            <h2 className="heading" tabIndex={-1} ref={headingRef}>
              {inquiry.prepared.heading}
            </h2>
            <p className="drawer__body">{inquiry.prepared.text}</p>

            <label className="visually-hidden" htmlFor={fieldId('prepared')}>Your inquiry message</label>
            <textarea
              id={fieldId('prepared')}
              ref={textRef}
              className="prepared__text"
              readOnly
              value={message}
              rows={message.split('\n').length + 1}
              onFocus={(e) => e.currentTarget.select()}
            />
            <p className="prepared__status" role="status">
              {copy === 'copied' && inquiry.prepared.copied}
              {copy === 'failed' && inquiry.prepared.copyFailed}
            </p>

            <div className="prepared__actions">
              <button type="button" className="btn btn--solid" onClick={copyMessage}>
                {inquiry.prepared.copy}
              </button>
              <a className="btn btn--line" href={contacts.facebook} target="_blank" rel="noopener noreferrer">
                {inquiry.prepared.facebook}
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
              {contacts.email && (
                <a className="btn btn--line" href={mailtoHref(contacts.email, message)}>
                  {inquiry.prepared.email}
                </a>
              )}
              <button type="button" className="btn btn--text" onClick={() => setMessage(null)}>
                {inquiry.prepared.edit}
              </button>
            </div>
            {contacts.email && <p className="field__help">{inquiry.prepared.emailHelper}</p>}
          </div>
        )}
      </div>
    </Dialog>
  );
}
