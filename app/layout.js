import './globals.css';

export const metadata = {
  title: 'Quote Generator with History',
  description: 'Generate inspirational quotes, copy with ease, and manage your favorites history stored in backend database.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
