import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen"
             style={{ background: 'var(--bg-primary)' }}>
            <Navbar />
            <main className="grow page-enter">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;