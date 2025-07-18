// components/CouncilContactForm.tsx

"use client";

import React, { useState, useTransition } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send, LoaderCircle } from 'lucide-react';

interface CouncilContactFormProps {
  dictionary: any;
}

export function CouncilContactForm({ dictionary }: CouncilContactFormProps) {
  const texts = dictionary?.contact_section;
  
  // Estados para manejar los datos, el envío y los mensajes de respuesta
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    council: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState({ type: '', text: '' });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormMessage({ type: '', text: '' }); // Limpiamos mensajes anteriores

    try {
      // Esta es la llamada real a nuestra API de backend
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Comprobamos si la API respondió correctamente (status 200-299)
      if (response.ok) {
        setFormMessage({ type: 'success', text: '¡Solicitud enviada con éxito! Nos pondremos en contacto pronto.' });
        // Opcional: limpiar el formulario tras el envío exitoso
        setFormData({ name: '', role: '', council: '', email: '', message: '' });
      } else {
        // La API respondió, pero con un error (ej: 500)
        const errorData = await response.json();
        setFormMessage({ type: 'error', text: `Error del servidor: ${errorData.message}` });
      }
    } catch (error) {
      // Error de red o de conexión (ej: no hay internet)
      console.error('Error de red al enviar el formulario:', error);
      setFormMessage({ type: 'error', text: 'No se pudo enviar la solicitud. Por favor, revise su conexión.' });
    } finally {
      // Esto se ejecuta siempre, tanto si hay éxito como si hay error
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="w-full py-20 md:py-32 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white">
            {texts?.title || "Hablemos de futuro."}
          </h2>
          <p className="mt-4 text-lg md:text-xl text-slate-600 dark:text-gray-300">
            {texts?.subtitle || "Rellene el formulario para agendar una demo."}
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">{texts?.label_name}</Label>
                <Input id="name" name="name" type="text" placeholder={texts?.placeholder_name} value={formData.name} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">{texts?.label_role}</Label>
                <Input id="role" name="role" type="text" placeholder={texts?.placeholder_role} value={formData.role} onChange={handleChange} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="council">{texts?.label_council}</Label>
              <Input id="council" name="council" type="text" placeholder={texts?.placeholder_council} value={formData.council} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{texts?.label_email}</Label>
              <Input id="email" name="email" type="email" placeholder={texts?.placeholder_email} value={formData.email} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">{texts?.label_message}</Label>
              <Textarea id="message" name="message" placeholder={texts?.placeholder_message} value={formData.message} onChange={handleChange} className="min-h-[100px]" />
            </div>
            <div className="text-center pt-4">
              <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isSubmitting}>
                {isSubmitting ? (
                  <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Send className="mr-2 h-5 w-5" />
                )}
                {isSubmitting ? 'Enviando...' : (texts?.button_submit || "Solicitar Demo")}
              </Button>
            </div>
          </form>
          {/* Div para mostrar mensajes de éxito o error */}
          {formMessage.text && (
            <div className={`mt-6 text-center p-4 rounded-md text-sm font-medium ${
              formMessage.type === 'success' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200' : 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200'
            }`}>
              {formMessage.text}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}