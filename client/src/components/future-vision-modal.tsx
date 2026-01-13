import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
    TrendingUp, 
    Ship, 
    Globe, 
    BarChart3, 
    PieChart, 
    ArrowRight, 
    ShieldCheck, 
    Clock,
    Target
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface FutureVisionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    dailyProfit: string;
}

export function FutureVisionModal({ open, onOpenChange, dailyProfit }: FutureVisionModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] p-0 gap-0 overflow-hidden bg-slate-50">
                
                {/* Hero Header */}
                <div className="relative h-48 bg-slate-900 overflow-hidden shrink-0">
                    <div className="absolute inset-0 bg-[url('/maersk_shipping_container_vessel_at_sea.webp')] bg-cover bg-center opacity-40"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
                    <div className="relative z-10 h-full flex flex-col justify-end p-6">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                Task Cycle Completed
                            </span>
                            <span className="text-emerald-400 font-mono text-sm font-bold">
                                +৳{Number(dailyProfit).toLocaleString()} Earned
                            </span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white font-heading leading-tight">
                            The Future of Maersk BD & You
                        </h2>
                        <p className="text-slate-300 text-sm mt-1 max-w-md">
                            Shaping the maritime logistics landscape of Bangladesh through strategic partnership.
                        </p>
                    </div>
                </div>

                <ScrollArea className="h-[calc(90vh-12rem)]">
                    <div className="p-6 space-y-8">
                        
                        {/* Vision Section */}
                        <section>
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                                <Globe className="h-5 w-5 text-blue-600" />
                                Strategic Vision 2030
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <Card className="bg-white border-none shadow-sm ring-1 ring-slate-100">
                                    <CardContent className="p-4">
                                        <div className="mb-3 h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <Ship className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <h4 className="font-bold text-slate-700 text-sm mb-1">Port Modernization</h4>
                                        <p className="text-xs text-slate-500 leading-relaxed">
                                            Expanding Chittagong & Mongla port capabilities to handle 3M+ TEUs annually by integrating automated logistics.
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-white border-none shadow-sm ring-1 ring-slate-100">
                                    <CardContent className="p-4">
                                        <div className="mb-3 h-8 w-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                                            <TrendingUp className="h-4 w-4 text-indigo-600" />
                                        </div>
                                        <h4 className="font-bold text-slate-700 text-sm mb-1">Market Dominance</h4>
                                        <p className="text-xs text-slate-500 leading-relaxed">
                                            Projecting 45% market share in BD's export logistics sector, driven by RMG and agricultural exports.
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </section>

                        {/* Financial Projections (KPIs) */}
                        <section className="bg-slate-900 rounded-2xl p-5 text-white shadow-xl shadow-slate-900/10">
                            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <BarChart3 className="h-4 w-4" />
                                Financial Projections (KPIs)
                            </h3>
                            <div className="grid grid-cols-3 gap-4 text-center divide-x divide-slate-800">
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase mb-1">Profitability</p>
                                    <p className="text-xl font-bold text-emerald-400">22.5%</p>
                                    <p className="text-[9px] text-slate-500">Net Margin YoY</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase mb-1">Market Share</p>
                                    <p className="text-xl font-bold text-blue-400">35%</p>
                                    <p className="text-[9px] text-slate-500">Current Capture</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase mb-1">Target ROI</p>
                                    <p className="text-xl font-bold text-purple-400">3.5x</p>
                                    <p className="text-[9px] text-slate-500">5-Year Horizon</p>
                                </div>
                            </div>
                        </section>

                        {/* Investment Roadmap */}
                        <section>
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                                <Target className="h-5 w-5 text-red-600" />
                                Phased Investment Roadmap
                            </h3>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center border-2 border-white shadow-sm font-bold text-xs">01</div>
                                        <div className="w-0.5 flex-1 bg-slate-200 my-1"></div>
                                    </div>
                                    <div className="pb-4">
                                        <h4 className="font-bold text-slate-800 text-sm">Seed Phase (Current)</h4>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Building community capital through micro-investment packages. Low barrier, guaranteed daily yields.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center border-2 border-white shadow-sm font-bold text-xs">02</div>
                                        <div className="w-0.5 flex-1 bg-slate-200 my-1"></div>
                                    </div>
                                    <div className="pb-4">
                                        <h4 className="font-bold text-slate-800 text-sm">Infrastructure Scaling</h4>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Deploying capital into warehouse automation and cold-chain logistics for premium ROI.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center border-2 border-white shadow-sm font-bold text-xs">03</div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-sm">Equity Dividend</h4>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Transitioning top-tier investors to direct profit-sharing partners in regional shipping hubs.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Actionable Insights */}
                        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                            <h4 className="text-sm font-bold text-orange-800 mb-2 flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4" />
                                Investment Parameters
                            </h4>
                            <ul className="space-y-2 text-xs text-orange-700/80 font-medium">
                                <li className="flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-orange-400"></span>
                                    Recommended Capital: Increase package tier for compound growth.
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-orange-400"></span>
                                    Risk Tolerance: Low (Backed by corporate logistics assets).
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-orange-400"></span>
                                    Horizon: 30-Day cycles optimized for liquidity.
                                </li>
                            </ul>
                        </div>

                    </div>
                </ScrollArea>

                {/* Footer */}
                <div className="p-4 bg-white border-t border-slate-100 flex flex-col gap-3">
                    <div className="text-center space-y-1">
                        <p className="text-slate-800 font-bold text-sm">Best Wishes for Your Success</p>
                        <p className="text-xs text-slate-500 flex items-center justify-center gap-1.5">
                            <Clock className="h-3 w-3" />
                            Please wait for the next day's task cycle.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Button 
                            variant="outline" 
                            className="rounded-xl font-bold"
                            onClick={() => onOpenChange(false)}
                        >
                            Close
                        </Button>
                        <Button 
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20"
                            onClick={() => window.location.href = '/products'}
                        >
                            Invest More <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    );
}
