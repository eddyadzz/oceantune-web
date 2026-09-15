'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Send, Loader2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { services as defaultServices, company as defaultCompany } from '@/lib/site-data';

export function ContactForm({
  services = defaultServices.map((s) => s.title),
  phone = defaultCompany.phone,
}: {
  services?: string[];
  phone?: string;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    message: '',
  });

  const phoneDigits = phone.replace(/\D/g, '');
  const whatsappMessage = `Hello Ocean Tune! I'm interested in your services${
    form.service ? ` (${form.service})` : ''
  }. Could you tell me more?`;
  const whatsappHref = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(whatsappMessage)}`;

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.email || !form.service || !form.message) {
      toast.error('Please fill in all fields before sending.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to send');
      }

      toast.success('Thank you! Your message has been sent. We will be in touch soon.');
      setForm({ name: '', phone: '', email: '', service: '', message: '' });
    } catch {
      toast.error('Something went wrong. Please try again or call us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            placeholder="Your full name"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+960 000 0000"
            value={form.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="service">Service Required *</Label>
          <Select
            value={form.service}
            onValueChange={(value) => handleChange('service', value)}
          >
            <SelectTrigger id="service" className="w-full">
              <SelectValue placeholder="Select a service" />
            </SelectTrigger>
            <SelectContent>
              {services.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          placeholder="Tell us about your requirements..."
          rows={5}
          value={form.message}
          onChange={(e) => handleChange('message', e.target.value)}
          required
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="submit"
          size="lg"
          className="w-full sm:w-auto rounded-full"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send Message
            </>
          )}
        </Button>
        {phoneDigits && (
          <Button
            asChild
            size="lg"
            variant="outline"
            className="w-full sm:w-auto rounded-full border-emerald-600 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
          >
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-4 w-4" />
              Contact on WhatsApp
            </a>
          </Button>
        )}
      </div>
    </form>
  );
}