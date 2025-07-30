import LoginRegister from '@/components/modules/account/LoginRegister';

const LoginPage = () => {
    // We will wrap this in a layout later that handles redirection if already logged in
    return (
        <main className="min-h-screen bg-black pt-40 pb-24 px-6 md:px-12">
            <LoginRegister />
        </main>
    );
};

export default LoginPage;