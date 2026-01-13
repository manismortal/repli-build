import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, AlertCircle, TrendingUp, Calendar, DollarSign } from "lucide-react";

interface PackageDetailDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    pkg: any;
    onPurchase: (pkg: any) => void;
}

export function PackageDetailDrawer({ open, onOpenChange, pkg, onPurchase }: PackageDetailDrawerProps) {
    if (!pkg) return null;

    const dailyReward = Number(pkg.dailyReward || 0);
    const price = Number(pkg.price || 0);
    const totalReturn = dailyReward * 30;
    const netProfit = totalReturn - price;

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent className="max-h-[96vh]">
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader className="text-left space-y-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <DrawerTitle className="text-2xl font-bold font-heading text-slate-900">
                                    {pkg.nameBn || pkg.name}
                                </DrawerTitle>
                                <DrawerDescription className="text-slate-500 font-medium mt-1 uppercase tracking-tighter">
                                    আপনার আয়ের নতুন দিগন্ত (New Income Horizon)
                                </DrawerDescription>
                            </div>
                            <Badge className="bg-primary/10 text-primary border-primary/20 text-lg font-bold px-3 py-1">
                                ৳{price}
                            </Badge>
                        </div>
                    </DrawerHeader>
                    
                    <ScrollArea className="p-4 h-[50vh]">
                        {/* Profit Analysis Card */}
                        <div className="bg-gradient-to-br from-primary/5 to-blue-50 rounded-2xl p-5 border border-primary/10 mb-6 shadow-sm">
                            <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                                <TrendingUp className="h-4 w-4" />
                                নিশ্চিত লাভের হিসাব (Guaranteed Profit)
                            </h3>
                            <div className="grid grid-cols-2 gap-y-5 gap-x-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">দৈনিক বোনাস</p>
                                    <p className="text-xl font-black text-slate-800">৳{dailyReward}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">মোট রিটার্ন</p>
                                    <p className="text-xl font-black text-green-600">৳{totalReturn}</p>
                                </div>
                                <div className="space-y-1 border-t border-slate-200 pt-3">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">নিট প্রফিট</p>
                                    <p className="text-xl font-black text-blue-600">৳{netProfit}</p>
                                </div>
                                <div className="space-y-1 border-t border-slate-200 pt-3">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">মেয়াদকাল</p>
                                    <p className="text-xl font-black text-slate-800">৩০ দিন</p>
                                </div>
                            </div>
                        </div>

                        {/* Rules Section */}
                        <div className="space-y-4 mb-6">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                কেন এই প্ল্যানটি সেরা? (Why this plan?)
                            </h3>
                            <ul className="space-y-3">
                                <li className="flex gap-3 text-sm text-slate-600 bg-white p-4 rounded-2xl shadow-sm border border-slate-50">
                                    <div className="h-6 w-6 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                                        <span className="text-[10px] font-bold text-primary">০১</span>
                                    </div>
                                    <span><strong>সহজ ইনকাম:</strong> প্রতিদিন মাত্র <strong>৫টি টাস্ক</strong> সম্পন্ন করে ঘরে বসেই আয় করুন আপনার কাঙ্ক্ষিত মুনাফা।</span>
                                </li>
                                <li className="flex gap-3 text-sm text-slate-600 bg-white p-4 rounded-2xl shadow-sm border border-slate-50">
                                    <div className="h-6 w-6 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                                        <span className="text-[10px] font-bold text-primary">০২</span>
                                    </div>
                                    <span><strong>স্বচ্ছতা:</strong> আপনার প্রফিট প্রতিদিন লাইভ আপডেট হবে এবং আপনি তা যেকোনো সময় ড্যাশবোর্ড থেকে দেখতে পারবেন।</span>
                                </li>
                                <li className="flex gap-3 text-sm text-slate-600 bg-white p-4 rounded-2xl shadow-sm border border-slate-50">
                                    <div className="h-6 w-6 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                                        <span className="text-[10px] font-bold text-primary">০৩</span>
                                    </div>
                                    <span><strong>সরাসরি পেমেন্ট:</strong> ৩০ দিনের মেয়াদ শেষে আপনার মোট আয় সরাসরি মূল ব্যালেন্সে যোগ হবে যা বিকাশ বা নগদে উত্তোলনযোগ্য।</span>
                                </li>
                                <li className="flex gap-3 text-sm text-slate-600 bg-white p-4 rounded-2xl shadow-sm border border-slate-50">
                                    <div className="h-6 w-6 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                                        <span className="text-[10px] font-bold text-primary">০৪</span>
                                    </div>
                                    <span><strong>রেফারেল বোনাস:</strong> বন্ধুদের ইনভাইট করলে পাচ্ছেন আকর্ষণীয় <strong>৪০% ইনস্ট্যান্ট কমিশন</strong> সরাসরি আপনার ওয়ালেটে!</span>
                                </li>
                            </ul>
                        </div>

                        {/* Note */}
                        <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex gap-3 mb-4">
                            <AlertCircle className="h-5 w-5 text-orange-600 shrink-0" />
                            <p className="text-[11px] text-orange-800 leading-relaxed">
                                <strong>প্রফেশনাল টিপস:</strong> প্রতিদিন সঠিক সময়ে টাস্ক সম্পন্ন করলে আপনার একাউন্টের র‍্যাঙ্ক বৃদ্ধি পাবে এবং দ্রুত উত্তোলনে সহায়তা করবে।
                            </p>
                        </div>
                    </ScrollArea>

                    <DrawerFooter className="pt-2">
                        <Button 
                            className="w-full h-14 text-lg font-black rounded-2xl shadow-xl shadow-primary/25 bg-primary hover:bg-primary/90 transition-all active:scale-95" 
                            onClick={() => {
                                onOpenChange(false);
                                onPurchase(pkg);
                            }}
                        >
                            শুরু করুন (Join Now)
                        </Button>
                        <DrawerClose asChild>
                            <Button variant="ghost" className="w-full h-10 rounded-xl text-slate-400 font-bold">
                                পরে দেখব
                            </Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
