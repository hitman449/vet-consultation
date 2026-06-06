import Link from "next/link";
import { Stethoscope, Video, CreditCard, Shield, Star, Clock } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-100 py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Stethoscope className="w-4 h-4" />
            Trusted by 10,000+ Pet Owners
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Expert Vet Care,{" "}
            <span className="text-green-600">From Home</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Book online consultations with certified veterinary doctors. Get
            professional advice for your pets via video call — anytime, anywhere.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/doctors"
              className="bg-green-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-green-700 transition-colors shadow-lg"
            >
              Find a Vet Doctor
            </Link>
            <Link
              href="/auth/register"
              className="bg-white text-green-600 border-2 border-green-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-green-50 transition-colors"
            >
              Join as Doctor
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">How It Works</h2>
          <p className="text-center text-gray-600 mb-12">Get expert vet consultation in 3 simple steps</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                icon: <Stethoscope className="w-8 h-8 text-green-600" />,
                title: "Choose a Doctor",
                desc: "Browse our verified veterinary specialists and pick one that fits your pet's needs.",
              },
              {
                step: "2",
                icon: <CreditCard className="w-8 h-8 text-green-600" />,
                title: "Pay & Book",
                desc: "Select a time slot and pay securely via UPI, card, or net banking through Razorpay.",
              },
              {
                step: "3",
                icon: <Video className="w-8 h-8 text-green-600" />,
                title: "Video Consultation",
                desc: "Join the video call at your scheduled time and get expert advice for your pet.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <div className="text-sm font-bold text-green-600 mb-2">STEP {item.step}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose VetCare?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Shield className="w-6 h-6 text-green-600" />, title: "Verified Doctors", desc: "All vets are licensed and certified professionals." },
              { icon: <Video className="w-6 h-6 text-green-600" />, title: "HD Video Calls", desc: "Crystal clear video consultations via browser — no app needed." },
              { icon: <CreditCard className="w-6 h-6 text-green-600" />, title: "Secure Payments", desc: "Pay via UPI, card, net banking. 100% secure via Razorpay." },
              { icon: <Clock className="w-6 h-6 text-green-600" />, title: "Flexible Timing", desc: "Book slots that fit your schedule — morning to evening." },
              { icon: <Star className="w-6 h-6 text-green-600" />, title: "Top Rated", desc: "Doctors rated by thousands of satisfied pet owners." },
              { icon: <Stethoscope className="w-6 h-6 text-green-600" />, title: "All Pets Welcome", desc: "Dogs, cats, birds, rabbits and more — we cover all species." },
            ].map((f) => (
              <div key={f.title} className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow flex gap-4">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center shrink-0">{f.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
                  <p className="text-gray-600 text-sm">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-green-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Your Pet Deserves the Best Care</h2>
          <p className="text-green-100 text-lg mb-8">
            Join thousands of pet owners who trust VetCare for expert veterinary advice.
          </p>
          <Link
            href="/auth/register"
            className="bg-white text-green-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-green-50 transition-colors inline-block"
          >
            Get Started — It&apos;s Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4 text-center text-sm">
        <p>© 2026 VetCare. All rights reserved. | Built with ❤️ for pets</p>
      </footer>
    </div>
  );
}
