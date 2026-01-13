import { useState } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Youtube, Globe, CheckCircle2, Clock, ShieldCheck, PlayCircle, ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function TaskGuidelines() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Card className="border-none shadow-xl overflow-hidden bg-white ring-1 ring-slate-100">
            {/* Always Visible Header / Quick Access */}
            <div 
                className="bg-gradient-to-r from-violet-600 to-indigo-600 p-4 cursor-pointer relative overflow-hidden group"
                onClick={() => setIsOpen(!isOpen)}
            >
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-white/20 transition-all duration-700"></div>
                
                <div className="flex items-center justify-between relative z-10 text-white">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                            <BookOpen className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-base font-heading leading-tight">টাস্ক গাইডলাইন</h3>
                            <p className="text-[11px] text-violet-100 font-medium opacity-90">কিভাবে কাজ করবেন? (Click to view)</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {/* Quick Status Icons */}
                        <div className="flex -space-x-2 mr-2">
                            <div className="h-7 w-7 rounded-full bg-red-500 border-2 border-indigo-600 flex items-center justify-center text-xs" title="Video">
                                <Youtube className="h-3 w-3 text-white" />
                            </div>
                            <div className="h-7 w-7 rounded-full bg-blue-500 border-2 border-indigo-600 flex items-center justify-center text-xs" title="Sub">
                                <PlayCircle className="h-3 w-3 text-white" />
                            </div>
                            <div className="h-7 w-7 rounded-full bg-purple-500 border-2 border-indigo-600 flex items-center justify-center text-xs" title="Web">
                                <Globe className="h-3 w-3 text-white" />
                            </div>
                        </div>
                        {isOpen ? <ChevronUp className="h-5 w-5 text-white/80" /> : <ChevronDown className="h-5 w-5 text-white/80" />}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <CardContent className="p-0 bg-slate-50/50">
                            <Accordion type="single" collapsible className="w-full">
                                
                                {/* Video Task Guide */}
                                <AccordionItem value="video" className="border-b border-slate-100 bg-white">
                                    <AccordionTrigger className="px-5 py-3 hover:bg-slate-50 hover:no-underline group">
                                        <div className="flex items-center gap-3 text-left">
                                            <div className="h-8 w-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Youtube className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-700 text-sm">ভিডিও টাস্ক</p>
                                                <p className="text-[10px] text-slate-400">Video Task Rules</p>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="px-5 pb-4 bg-slate-50/30">
                                        <ul className="space-y-2.5 ml-1">
                                            <Step number="০১" title="সম্পূর্ণ দেখুন (Watch)" desc="ভিডিওটি চালু করে শেষ পর্যন্ত দেখুন। মাঝপথে বন্ধ করবেন না।" color="text-red-500" />
                                            <Step number="০২" title="বুঝে নিন (Understand)" desc="ভিডিওর মূল বিষয়বস্তু মনোযোগ দিয়ে দেখুন।" color="text-red-500" />
                                            <Step number="০৩" title="নিশ্চিত করুন (Confirm)" desc="টাইমার শেষ হলে স্বয়ংক্রিয়ভাবে টাস্ক সম্পন্ন হবে।" color="text-red-500" />
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* Subscription Task Guide */}
                                <AccordionItem value="subscription" className="border-b border-slate-100 bg-white">
                                    <AccordionTrigger className="px-5 py-3 hover:bg-slate-50 hover:no-underline group">
                                        <div className="flex items-center gap-3 text-left">
                                            <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <PlayCircle className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-700 text-sm">সাবস্ক্রিপশন</p>
                                                <p className="text-[10px] text-slate-400">Subscription Rules</p>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="px-5 pb-4 bg-slate-50/30">
                                        <ul className="space-y-2.5 ml-1">
                                            <Step number="০১" title="যাচাই করুন (Verify)" desc="লিংকে ক্লিক করে সঠিক চ্যানেল বা পেজে যান।" color="text-blue-500" />
                                            <Step number="০২" title="এক্টিভ থাকুন (Active)" desc="সাবস্ক্রাইব করে বেল আইকন প্রেস করুন।" color="text-blue-500" />
                                            <Step number="০৩" title="রেকর্ড (Record)" desc="কাজ শেষ হলে ফিরে এসে ভেরিফাই করুন।" color="text-blue-500" />
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* Web Visit Task Guide */}
                                <AccordionItem value="web" className="bg-white">
                                    <AccordionTrigger className="px-5 py-3 hover:bg-slate-50 hover:no-underline group">
                                        <div className="flex items-center gap-3 text-left">
                                            <div className="h-8 w-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Globe className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-700 text-sm">ওয়েব ভিজিট</p>
                                                <p className="text-[10px] text-slate-400">Website Visit Rules</p>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="px-5 pb-4 bg-slate-50/30">
                                        <ul className="space-y-2.5 ml-1">
                                            <Step number="০১" title="ভিজিট করুন (Navigate)" desc="টার্গেট ওয়েবসাইটে প্রবেশ করুন।" color="text-purple-500" />
                                            <Step number="০২" title="সময় দিন (Engage)" desc="পেজটি স্ক্রল করুন এবং ৬০ সেকেন্ড অপেক্ষা করুন।" color="text-purple-500" />
                                            <Step number="০৩" title="যাচাইকরণ (Validate)" desc="সময় শেষ না হওয়া পর্যন্ত ট্যাব বন্ধ করবেন না।" color="text-purple-500" />
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>

                            </Accordion>

                            {/* General Rules Footer */}
                            <div className="bg-slate-100 p-4 border-t border-slate-200">
                                <div className="grid grid-cols-3 gap-3">
                                    <RuleBadge icon={CheckCircle2} text="১০০% সঠিকতা" color="text-green-600" bg="bg-green-100" />
                                    <RuleBadge icon={Clock} text="সঠিক সময়" color="text-orange-600" bg="bg-orange-100" />
                                    <RuleBadge icon={ShieldCheck} text="প্রফেশনাল" color="text-blue-600" bg="bg-blue-100" />
                                </div>
                            </div>
                        </CardContent>
                    </motion.div>
                )}
            </AnimatePresence>
        </Card>
    );
}

function Step({ number, title, desc, color }: { number: string, title: string, desc: string, color: string }) {
    return (
        <li className="flex gap-3 text-sm text-slate-600 bg-white p-2.5 rounded-lg border border-slate-100 shadow-sm">
            <span className={`font-bold ${color} text-xs mt-0.5`}>{number}</span>
            <div className="flex-1">
                <p className={`text-xs font-bold ${color} mb-0.5`}>{title}</p>
                <p className="text-[11px] leading-snug text-slate-500">{desc}</p>
            </div>
        </li>
    );
}

function RuleBadge({ icon: Icon, text, color, bg }: { icon: any, text: string, color: string, bg: string }) {
    return (
        <div className={`${bg} rounded-lg p-2 text-center border border-white/50 shadow-sm flex flex-col items-center justify-center gap-1`}>
            <Icon className={`h-3.5 w-3.5 ${color}`} />
            <p className={`text-[10px] ${color} font-bold`}>{text}</p>
        </div>
    );
}