import { AuthForm } from '@/components/modules/auth/AuthForm';
// THE FIX: This now imports the correct background component that we created.
import { SubtleSmokeBackground } from '@/components/core/SubtleSmokeBackground';

const LoginPage = () => {
    return (
        <div className="min-h-screen">
            {/* 
              This component doesn't need to be rendered here because the 
              AuthForm component now contains its own Canvas and background.
              Removing this prevents two canvases from rendering.
            */}
            <main className="relative min-h-screen bg-black pt-40 pb-24 px-6 md:px-12 flex items-center justify-center">
                <div className="w-full">
                    <AuthForm />
                </div>
            </main>
        </div>
    );
};

export default LoginPage;
