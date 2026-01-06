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
  "রহিম", "করিম", "জামাল", "কামাল", "আব্দুল্লাহ", "সুমন", "রাকিব", "আরিফ", "হাসান", "সোহেল",
  "মিন্টু", "বাবু", "সাগর", "লিটন", "মাসুম", "ফরিদ", "জহির", "আলামিন", "রনি", "মিরাজ",
  "তানভীর", "শাকিল", "নাহিদ", "বিপুল", "আকাশ", "মেহেদী", "শিপন", "তারেক", "রাজু", "সজীব",
  "ফারুক", "মিলন", "নাসির", "পলাশ", "রিপন", "উজ্জ্বল", "বশির", "আজাদ", "মইন", "সাইফুল",
  "মুন্না", "জুয়েল", "রুবেল", "শামীম", "ইমরান", "রাশেদ", "তৌহিদ", "ফয়সাল", "সাদী", "আকরাম",
  "সুলতানা", "ফাতেমা", "আয়েশা", " খাদিজা", "নাজমা", "সাথী", "রিনা", "মিনা", "শিউলি", "পারভীন",
  "সালমা", "রুনা", "লিপি", "মুন্নি", "শারমিন", "নাছিমা", "রাবেয়া", "কুলসুম", "হালিমা", "সুমি",
  "জান্নাত", "তানিয়া", "ফারজানা", "সাবিনা", "রত্না", "মরিয়ম", "রোকসানা", "লিজা", "পপি", "নাদিয়া",
  "নিপা", "সোনিয়া", "বৃষ্টি", "শিমু", "লাবনী", "আঁখি", "ববিতা", "শাবনূর", "মৌসুমি", "পূর্ণিমা"
];

const SURNAMES = [
  "খান", "মিয়া", "আলী", "হোসেন", "আহমেদ", "রহমান", "ইসলাম", "চৌধুরী", "তালুকদার", "মোল্লা",
  "শিকদার", "হাওলাদার", "বিশ্বাস", "ব্যাপারী", "সরকার", "মন্ডল", "কাজী", "ভূঁইয়া", "বসু", "পাল"
];

const REVIEWS_PART_1 = [
  "মায়েরস্ক লাইন বিডি আমার জীবন বদলে দিয়েছে।",
  "খুবই ভালো একটি প্ল্যাটফর্ম।",
  "বিনিয়োগ করে আমি এখন স্বাবলম্বী।",
  "প্রতিদিন ইনকাম করার সেরা মাধ্যম।",
  "খুব সহজেই টাকা আয় করা যায়।",
  "বিশ্বাসযোগ্য একটি সাইট।",
  "আমি নিয়মিত পেমেন্ট পাচ্ছি।",
  "ছাত্রজীবনে এমন আয় অকল্পনীয় ছিল।",
  "ঘরে বসেই এখন আয় করছি।",
  "বন্ধুদের রেফার করে অনেক বোনাস পেয়েছি।"
];

const REVIEWS_PART_2 = [
  "ধন্যবাদ মায়েরস্ক লাইন বিডি।",
  "সবাইকে এখানে কাজ করার পরামর্শ দিব।",
  "এত সুন্দর সিস্টেম আগে দেখিনি।",
  "আমার পরিবারের সবাই এখন এখানে কাজ করে।",
  "আর্থিক সমস্যা এখন আর নেই।",
  "৫ স্টার রেটিং দিলাম!",
  "সাপোর্ট সার্ভিস খুবই ভালো।",
  "টাকা উঠাতে কোনো ঝামেলা নেই।",
  "অল্প পুঁজিতে বেশি লাভ।",
  "ভবিষ্যতের জন্য সেরা বিনিয়োগ।"
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
    const name = `${NAMES[Math.floor(Math.random() * NAMES.length)]} ${SURNAMES[Math.floor(Math.random() * SURNAMES.length)]}`;
    const username = `@maersk_${Math.floor(1000 + Math.random() * 9000)}`;
    const review = `${REVIEWS_PART_1[Math.floor(Math.random() * REVIEWS_PART_1.length)]} ${REVIEWS_PART_2[Math.floor(Math.random() * REVIEWS_PART_2.length)]}`;
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
