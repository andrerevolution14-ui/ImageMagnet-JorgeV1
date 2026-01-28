import Funnel from '@/components/Funnel';

export default function Home() {
    return (
        <main className="min-h-screen relative overflow-hidden bg-white">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

            <div className="absolute top-0 left-0 w-full h-full -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px] animate-pulse" />
            </div>

            {/* Float Branding */}
            <div className="fixed top-6 left-6 z-50 flex items-center gap-2 opacity-50 select-none hover:opacity-100 transition-opacity">
                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-lg">J</div>
                <span className="font-bold text-slate-900 tracking-tighter">AVEIRO</span>
            </div>

            {/* Funnel Section */}
            <div className="min-h-screen flex items-center justify-center py-20">
                <Funnel />
            </div>
        </main>
    );
}
