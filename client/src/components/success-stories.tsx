import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const NAMES = [
  "আব্দুল্লাহ", "রহমান", "করিম", "ফাতেমা", "আয়েশা", "মোহাম্মদ", "উমর", "আলী", "হাসান", "হুসাইন",
  "খাদিজা", "মারিয়া", "ইউসুফ", "ইব্রাহিম", "মুসা", "ইসমাইল", "সারাহ", "জান্নাত", "সুমাইয়া", "বিলাল",
  "হামজা", "জয়নব", "আবু বকর", "উসমান", "সালমান", "সাদিয়া", "নুসরাত", "হালিমা", "রাবেয়া", "কুলসুম",
  "আমিনুল", "সাজ্জাদ", "রফিক", "শফিক", "জুবায়ের", "তানভীর", "মেহেদী", "নাঈম", "ফারিহা", "তাসনিম",
  "আরিফ", "মাসুম", "সাইফুল", "রাকিব", "সুমন", "জুয়েল", "মুন্না", "রিপন", "লিটন", "জাহাঙ্গীর",
  "ফারজানা", "শারমিন", "নাজমা", "সুলতানা", "পারভীন", "লাবনী", "মনি", "রুনা", "মুক্তা", "শিউলি"
];

const REVIEWS = [
  "আলহামদুলিল্লাহ, মায়েরস্ক লাইন বিডি থেকে আমি নিয়মিত আয় করছি। খুবই ভালো উদ্যোগ।",
  "সততার সাথে পেমেন্ট দিচ্ছে। আল্লাহ আপনাদের বরকত দান করুন।",
  "বেকারত্ব দূর করার জন্য এটি একটি অসাধারণ প্ল্যাটফর্ম। আমি খুবই উপকৃত হয়েছি।",
  "প্রথমে বিশ্বাস করিনি, কিন্তু এখন দেখি আসলেই এখান থেকে ভালো ইনকাম সম্ভব।",
  "খুবই সহজ কাজ, ঘরে বসেই আয় করা যায়। মা-বোনদের জন্য সেরা সুযোগ।",
  "ছাত্রজীবনে নিজের খরচ নিজেই চালাতে পারছি, ধন্যবাদ মায়েরস্ক লাইন বিডি।",
  "বিনিয়োগ করে ঠকিনি, আলহামদুলিল্লাহ। নিয়মিত লাভ পাচ্ছি।",
  "সাপোর্ট সার্ভিস খুবই আন্তরিক। যেকোনো সমস্যায় দ্রুত সমাধান পাওয়া যায়।",
  "আমার দেখা সেরা ইনভেস্টমেন্ট সাইট। সবাই নিশ্চিন্তে কাজ করতে পারেন।",
  "আল্লাহর রহমতে এখান থেকে আমি স্বাবলম্বী হওয়ার স্বপ্ন দেখছি।",
  "প্রতিদিন ইনকাম, প্রতিদিন উইথড্র। এর চেয়ে ভালো আর কী হতে পারে?",
  "বন্ধুদের রেফার করে ভালো বোনাস পেয়েছি। সবাই মিলে কাজ করছি।",
  "খুবই স্বচ্ছ এবং সুন্দর সিস্টেম। কোনো লুকোচুরি নেই।",
  "ধৈর্য ধরে কাজ করলে এখানে সফলতা আসবেই ইনশাআল্লাহ।",
  "দীর্ঘদিন ধরে খুঁজছিলাম এমন একটি বিশ্বাসযোগ্য প্ল্যাটফর্ম। অবশেষে পেলাম।"
];

interface Testimonial {
  id: number;
  name: string;
  username: string;
  review: string;
  rating: number;
}

const generateTestimonials = (count: number): Testimonial[] => {
  const testimonials: Testimonial[] = [];
  for (let i = 0; i < count; i++) {
    const name = NAMES[Math.floor(Math.random() * NAMES.length)];
    const username = `@user_${Math.floor(1000 + Math.random() * 9000)}`;
    const review = REVIEWS[Math.floor(Math.random() * REVIEWS.length)];
    testimonials.push({
      id: i + 1,
      name,
      username,
      review,
      rating: 5
    });
  }
  return testimonials;
};

export function SuccessStories() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  useEffect(() => {
    setTestimonials(generateTestimonials(100));
  }, []);

  return (
    <Card className="hover-elevate bg-gradient-to-br from-indigo-50 to-blue-50 border-none shadow-lg">
      <CardHeader>
        <CardTitle className="font-heading text-2xl flex items-center gap-2 text-indigo-900">
          <Quote className="h-6 w-6 text-indigo-500 fill-indigo-500" />
          সফলতার গল্প
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Carousel
          plugins={[plugin.current]}
          className="w-full"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent>
            {testimonials.map((item) => (
              <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card className="border-none shadow-sm bg-white/80 backdrop-blur-sm h-full">
                    <CardContent className="flex flex-col gap-4 p-6">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-indigo-100">
                          <AvatarFallback className="bg-indigo-100 text-indigo-600 font-bold">
                            {item.name.substring(0, 1)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{item.name}</p>
                          <p className="text-[10px] text-slate-500">{item.username}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-0.5">
                        {[...Array(item.rating)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>

                      <p className="text-sm text-slate-600 leading-relaxed font-medium">
                        "{item.review}"
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="-left-2" />
            <CarouselNext className="-right-2" />
          </div>
        </Carousel>
      </CardContent>
    </Card>
  );
}
