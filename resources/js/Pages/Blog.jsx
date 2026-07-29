import BlogMain from "@/Components/BlogMain";
import Header from "@/Components/Header";
import BlogRight from "@/Components/Home/BlogRight";
import { Head } from "@inertiajs/react";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import blog_1 from "@/assets/blog-3-3.jpg";
import blog_2 from "@/assets/blog-7-1.jpg";
import blog_3 from "@/assets/blog-8-1.jpg";
import Footer from "@/Components/Footer";

const data = [
    {
        id: 1,
        head: "Travel",
        title: "The best places to visit in the world",
        image: blog_1,
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eget sem vitae eros rhoncus ...",
        comment: "4",
        date: "2 days ago",
    },
    {
        id: 2,
        head: "Travel",
        title: "The best places to visit in the world",
        image: blog_2,
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eget sem vitae eros rhoncus ...",
        comment: "1",
        date: "5 days ago",
    },
    {
        id: 3,
        head: "Travel",
        title: "The best places to visit in the world",
        image: blog_3,
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eget sem vitae eros rhoncus ...",
        comment: "2",
        date: "3 days ago",
    },
    {
        id: 4,
        head: "Travel",
        title: "The best places to visit in the world",
        image: blog_1,
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eget sem vitae eros rhoncus ...",
        comment: "4",
        date: "2 days ago",
    },
];

export default function Blog() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const ref = useRef(null);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["0 1", "1.33 1"], // Triggers animation when the section is in view
    });

    const scaleProgress = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
    const opacityProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);

    return (
        <>
            <Head title="Blog" />

            <div className="bg-slate-900">
                <Header
                    mobileMenuOpen={mobileMenuOpen}
                    setMobileMenuOpen={setMobileMenuOpen}
                />

                <div className="max-w-4xl mx-4 lg:mx-auto pt-28 pb-14 lg:py-36">
                    <h3 className="text-sm lg:text-base font-semibold uppercase tracking-tight text-gray-100">
                        Blog
                    </h3>
                    <p className="mt-2 text-white text-3xl lg:text-5xl font-bold tracking-wider">
                        The latest articles and news
                    </p>

                    <p className="mt-4 text-sm lg:text-base text-gray-300 tracking-wide">
                        Stay up-to-date with the latest industry news as our
                        marketing teams finds new ways to help you grow.
                    </p>
                </div>

                <div className="bg-white">
                    <div className="mx-4 lg:mx-auto max-w-2xl lg:max-w-8xl py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-4 gap-10">
                        <div className="lg:col-span-3">
                            {data.map((item) => (
                                <motion.div>
                                    <BlogMain {...item} />
                                </motion.div>
                            ))}
                        </div>

                        <BlogRight />
                    </div>
                </div>

                <Footer />
            </div>
        </>
    );
}
