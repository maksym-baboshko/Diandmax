"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { SectionWrapper, SectionHeading, AnimatedReveal, Button, Label, Input, Textarea } from "@/shared/ui";
import { cn } from "@/shared/lib";

import { rsvpSchema, type RSVPFormData } from "./schema";

export function RSVP() {
  const t = useTranslations("RSVP");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<RSVPFormData>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: { guests: 1 },
  });

  const attending = watch("attending");

  const onSubmit = async (data: RSVPFormData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Form submission error:", err);
      setError(t("error_generic"));
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <SectionWrapper id="rsvp" className="py-24">
        <AnimatedReveal direction="up" className="max-w-md mx-auto text-center py-16 px-8 rounded-[2.5rem] bg-bg-secondary/50 backdrop-blur-sm border border-accent/20 shadow-2xl">
          <div className="text-6xl mb-8 animate-bounce">🎉</div>
          <h3 className="heading-serif text-3xl md:text-4xl text-text-primary mb-6">{t("success")}</h3>
          <Button onClick={() => setSubmitted(false)} variant="outline">
            ← {t("return_button")}
          </Button>
        </AnimatedReveal>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper id="rsvp" className="py-24 relative overflow-hidden">
      <SectionHeading subtitle={t("subtitle")}>{t("title")}</SectionHeading>

      <div className="max-w-7xl mx-auto mt-24 md:mt-32 px-4 relative z-10 flex flex-col xl:flex-row items-center justify-center">
        <div className="w-full max-w-2xl shrink-0 relative py-12">

          <div className="hidden lg:block">
            <motion.div
              initial={{ opacity: 0, x: 40, y: 40 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -top-4 -left-36 xl:-left-45 w-52 xl:w-60 z-0"
            >
              <div className="relative group">
                <div className="relative aspect-3/4 rounded-[2.5rem] overflow-hidden border border-accent/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-transform duration-700 hover:scale-[1.05] hover:rotate-6 rotate-2">
                  <Image
                    src="/images/rsvp/1.jpeg"
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 240px, 208px"
                    loading="lazy"
                    className="object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40, y: -40 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -bottom-8 -left-36 xl:-left-45 w-52 xl:w-60 z-10"
            >
              <div className="relative group">
                <div className="relative aspect-3/4 rounded-[2.5rem] overflow-hidden border border-accent/30 shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-transform duration-700 hover:scale-[1.05] hover:-rotate-6 -rotate-2">
                  <Image
                    src="/images/rsvp/2.jpeg"
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 240px, 208px"
                    loading="lazy"
                    className="object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -40, y: 40 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -top-4 -right-36 xl:-right-45 w-52 xl:w-60 z-0"
            >
              <div className="relative group">
                <div className="relative aspect-3/4 rounded-[2.5rem] overflow-hidden border border-accent/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-transform duration-700 hover:scale-[1.05] hover:-rotate-6 -rotate-2">
                  <Image
                    src="/images/rsvp/3.jpeg"
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 240px, 208px"
                    loading="lazy"
                    className="object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -40, y: -40 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -bottom-8 -right-36 xl:-right-45 w-52 xl:w-60 z-10"
            >
              <div className="relative group">
                <div className="relative aspect-3/4 rounded-[2.5rem] overflow-hidden border border-accent/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-transform duration-700 hover:scale-[1.05] hover:rotate-6 rotate-2">
                  <Image
                    src="/images/rsvp/4.jpeg"
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 240px, 208px"
                    loading="lazy"
                    className="object-cover object-[center_60%] grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          <AnimatedReveal
            direction="up"
            duration={1.2}
            blur
            className="relative z-20 bg-bg-primary/45 rounded-[2.5rem] border border-accent/15 shadow-[0_30px_100px_rgba(0,0,0,0.25)] overflow-hidden group/form"
          >
            <div className="absolute inset-0 rounded-[2.5rem] border border-accent/0 group-hover/form:border-accent/30 transition-colors duration-500 pointer-events-none z-20" />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 p-8 md:p-12 relative z-10">
              <div className="absolute -top-32 -right-32 w-80 h-80 bg-accent/20 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-accent/20 rounded-full blur-[100px] pointer-events-none" />

              <div className="space-y-8 relative z-10">
                <div className="space-y-2">
                  <Label htmlFor="name" required>{t("name_label")}</Label>
                  <Input
                    id="name"
                    placeholder={t("name_placeholder")}
                    error={!!errors.name}
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500/70">{t("name_min")}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label>{t("attending_label")}</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setValue("attending", "yes", { shouldValidate: true })}
                      className={cn(
                        "flex items-center justify-center gap-3 px-6 py-5 rounded-2xl border transition-all duration-500 font-medium group relative overflow-hidden cursor-pointer",
                        attending === "yes"
                          ? "bg-accent text-white border-accent shadow-xl shadow-accent/20"
                          : "bg-bg-primary text-text-secondary border-accent/10 hover:border-accent/40 hover:text-text-primary"
                      )}
                    >
                      <span className={cn("text-2xl transition-transform duration-500", attending === "yes" ? "scale-110" : "grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100")}>😎</span>
                      {t("attending_yes")}
                      {attending === "yes" && (
                        <div className="absolute inset-0 bg-white/10 animate-pulse pointer-events-none" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setValue("attending", "no", { shouldValidate: true })}
                      className={cn(
                        "flex items-center justify-center gap-3 px-6 py-5 rounded-2xl border transition-all duration-500 font-medium group relative overflow-hidden cursor-pointer",
                        attending === "no"
                          ? "bg-text-primary text-bg-primary border-text-primary shadow-xl shadow-black/10"
                          : "bg-bg-primary text-text-secondary border-accent/10 hover:border-accent/40 hover:text-text-primary"
                      )}
                    >
                      <span className={cn("text-2xl transition-transform duration-500", attending === "no" ? "scale-110" : "grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100")}>😔</span>
                      {t("attending_no")}
                    </button>
                  </div>
                </div>

                <div className={cn(
                  "space-y-8 overflow-hidden transition-all duration-500 ease-in-out",
                  attending === "yes" ? "max-h-125 opacity-100 pb-2" : "max-h-0 opacity-0"
                )}>
                  <div className="pt-4 border-t border-accent/5 space-y-8">
                    <div className="space-y-2">
                      <Label htmlFor="guests">{t("guests_label")}</Label>
                      <Input id="guests" type="number" min="1" max="10" className="md:w-32" {...register("guests")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dietary">{t("dietary_label")}</Label>
                      <Textarea id="dietary" placeholder={t("dietary_placeholder")} {...register("dietary")} />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">{t("message_label")}</Label>
                  <Textarea id="message" placeholder={t("message_placeholder")} {...register("message")} />
                </div>

                <div className="pt-6">
                  {error && (
                    <p className="text-center text-sm text-red-500/80 mb-4 animate-pulse">
                      {error}
                    </p>
                  )}
                  <Button
                    type="submit"
                    className="w-full py-5 text-xl shadow-2xl shadow-accent/20 group relative overflow-hidden"
                    disabled={!attending || loading}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {loading ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          {t("submit")}
                          <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-linear-to-r from-accent to-accent-soft opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Button>
                  {!attending && !loading && (
                    <p className="text-center text-sm text-red-500/60 mt-4 animate-pulse">
                      {t("attendance_required")}
                    </p>
                  )}
                </div>
              </div>
            </form>
          </AnimatedReveal>
        </div>
      </div>
    </SectionWrapper>
  );
}
