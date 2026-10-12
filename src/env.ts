export const ENV = {
  WEB3FORMS_ACCESS_KEY: 'ddd31534-f1b6-47fb-84a9-7d998299513e',
  WEB3FORMS_API_URL: 'https://api.web3forms.com/submit',
  GOOGLE_SHEETS_CONTACT_URL: 'https://script.google.com/macros/s/AKfycbygp3Zch4TodP1k2VG0xh9zjZPc-NmjvOR-y7wBU24GfoyED4IXhIl8FQ76sv66CyPCuA/exec',
  GOOGLE_SHEETS_GENERAL_URL: 'https://script.google.com/macros/s/AKfycbwpwtDVKM85IDFdH_IC13Ly-zE0MP3Dx9J7e8NrDZ0I2R-oGUdCUlNcabUEIfFUFVYrXw/exec'
};

if (typeof window !== 'undefined') {
  (window as any).SREW_ENV = ENV;
}
