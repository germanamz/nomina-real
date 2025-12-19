'use client';

import { useState, useEffect } from 'react';
import { clearAllCalculations } from '@/app/lib/utils/storage';

type Language = 'en' | 'es';

interface PrivacyDisclaimerProps {
  onHistoryCleared?: () => void;
}

const content = {
  en: {
    title: 'Privacy & Data Storage',
    ariaLabel: 'Privacy and data storage information',
    clearHistory: 'Clear History',
    clearHistoryConfirm: 'Are you sure you want to clear all calculation history? This action cannot be undone.',
    clearHistorySuccess: 'All calculation history has been cleared.',
    sections: {
      localStorage: {
        title: 'Local Data Storage',
        text: "This application stores all calculation data exclusively in your browser's local storage on your device. No data is transmitted to, stored on, or processed by any external servers. All information remains on your local machine and is never shared with third parties.",
      },
      privacyRights: {
        title: 'Your Privacy Rights',
        intro: 'Under applicable privacy laws, you have the right to:',
        items: [
          { label: 'Access:', text: "View all data stored in your browser's local storage" },
          { label: 'Delete:', text: "Clear all stored data at any time using the application's clear history feature" },
          { label: 'Control:', text: 'Manage your data directly through your browser settings' },
        ],
      },
      dataCollection: {
        title: 'Data Collection',
        text: "This application does not collect, process, or store any personal information on external servers. Since all data remains on your device, no data breach or unauthorized access to external systems is possible. You are solely responsible for the security of your device and browser.",
      },
      compliance: {
        title: 'Compliance',
        intro: 'This application is designed to comply with privacy regulations including:',
        items: [
          { label: 'CCPA (California Consumer Privacy Act):', text: 'No personal information is sold or shared' },
          { label: 'GDPR (General Data Protection Regulation):', text: 'Data processing occurs only on your device' },
          { label: 'LFPDPPP (Ley Federal de Protección de Datos Personales en Posesión de los Particulares):', text: 'No personal data is collected or processed externally' },
        ],
      },
      note: {
        text: 'To completely remove all stored data, you can clear your browser\'s local storage through your browser settings or use the "Clear History" feature within this application.',
      },
    },
  },
  es: {
    title: 'Privacidad y Almacenamiento de Datos',
    ariaLabel: 'Información sobre privacidad y almacenamiento de datos',
    clearHistory: 'Limpiar Historial',
    clearHistoryConfirm: '¿Está seguro de eliminar todo el historial de cálculos? Esta acción no se puede deshacer.',
    clearHistorySuccess: 'Todo el historial de cálculos ha sido eliminado.',
    sections: {
      localStorage: {
        title: 'Almacenamiento Local de Datos',
        text: 'Esta aplicación almacena todos los datos de cálculo exclusivamente en el almacenamiento local de su navegador en su dispositivo. Ningún dato se transmite, almacena o procesa en servidores externos. Toda la información permanece en su máquina local y nunca se comparte con terceros.',
      },
      privacyRights: {
        title: 'Sus Derechos de Privacidad',
        intro: 'Bajo las leyes de privacidad aplicables, usted tiene derecho a:',
        items: [
          { label: 'Acceso:', text: 'Ver todos los datos almacenados en el almacenamiento local de su navegador' },
          { label: 'Eliminar:', text: 'Borrar todos los datos almacenados en cualquier momento usando la función de limpiar historial de la aplicación' },
          { label: 'Control:', text: 'Gestionar sus datos directamente a través de la configuración de su navegador' },
        ],
      },
      dataCollection: {
        title: 'Recopilación de Datos',
        text: 'Esta aplicación no recopila, procesa ni almacena información personal en servidores externos. Dado que todos los datos permanecen en su dispositivo, no es posible ninguna violación de datos o acceso no autorizado a sistemas externos. Usted es el único responsable de la seguridad de su dispositivo y navegador.',
      },
      compliance: {
        title: 'Cumplimiento',
        intro: 'Esta aplicación está diseñada para cumplir con las regulaciones de privacidad incluyendo:',
        items: [
          { label: 'CCPA (Ley de Privacidad del Consumidor de California):', text: 'No se vende ni se comparte información personal' },
          { label: 'GDPR (Reglamento General de Protección de Datos):', text: 'El procesamiento de datos ocurre solo en su dispositivo' },
          { label: 'LFPDPPP (Ley Federal de Protección de Datos Personales en Posesión de los Particulares):', text: 'No se recopila ni procesa información personal externamente' },
        ],
      },
      note: {
        text: 'Para eliminar completamente todos los datos almacenados, puede limpiar el almacenamiento local de su navegador a través de la configuración de su navegador o usar la función "Limpiar Historial" dentro de esta aplicación.',
      },
    },
  },
};

export default function PrivacyDisclaimer({ onHistoryCleared }: PrivacyDisclaimerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<Language>('es');

  // Detect language from HTML lang attribute or browser preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const htmlLang = document.documentElement.lang;
      if (htmlLang.startsWith('es')) {
        setLanguage('es');
      } else {
        setLanguage('en');
      }
    }
  }, []);

  const t = content[language];

  const handleClearHistory = () => {
    if (window.confirm(t.clearHistoryConfirm)) {
      clearAllCalculations();
      if (onHistoryCleared) {
        onHistoryCleared();
      }
      alert(t.clearHistorySuccess);
    }
  };

  return (
    <div className="mt-8 border-t border-gray-200 pt-6">
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between flex-1 text-left text-sm text-gray-600 hover:text-gray-900 transition-colors"
          aria-expanded={isOpen}
          aria-label={t.ariaLabel}
        >
          <span className="font-medium">{t.title}</span>
          <svg
            className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => setLanguage('en')}
            className={`px-2 py-1 text-xs rounded transition-colors ${language === 'en'
              ? 'bg-blue-100 text-blue-700 font-medium'
              : 'text-gray-500 hover:text-gray-700'
              }`}
            aria-label="English"
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('es')}
            className={`px-2 py-1 text-xs rounded transition-colors ${language === 'es'
              ? 'bg-blue-100 text-blue-700 font-medium'
              : 'text-gray-500 hover:text-gray-700'
              }`}
            aria-label="Español"
          >
            ES
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="mt-4 text-sm text-gray-600 space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">{t.sections.localStorage.title}</h3>
            <p>{t.sections.localStorage.text}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">{t.sections.privacyRights.title}</h3>
            <p className="mb-2">{t.sections.privacyRights.intro}</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              {t.sections.privacyRights.items.map((item, index) => (
                <li key={index}>
                  <strong>{item.label}</strong> {item.text}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">{t.sections.dataCollection.title}</h3>
            <p>{t.sections.dataCollection.text}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">{t.sections.compliance.title}</h3>
            <p>{t.sections.compliance.intro}</p>
            <ul className="list-disc list-inside space-y-1 ml-2 mt-1">
              {t.sections.compliance.items.map((item, index) => (
                <li key={index}>
                  <strong>{item.label}</strong> {item.text}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-blue-900 text-xs mb-3">
              <strong>{language === 'en' ? 'Note:' : 'Nota:'}</strong> {t.sections.note.text}
            </p>
            <button
              onClick={handleClearHistory}
              className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors"
            >
              {t.clearHistory}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

