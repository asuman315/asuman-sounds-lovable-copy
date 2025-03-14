
import { useState } from "react";
import AnimatedElement from "./AnimatedElement";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      toast({
        title: "Message sent successfully",
        description: "We'll get back to you as soon as possible.",
      });
      
      // Reset form after a delay
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          message: "",
        });
        setSubmitted(false);
      }, 3000);
    }, 1500);
  };

  return (
    <section id="contact" className="py-20 md:py-32 bg-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-secondary/30 to-transparent"></div>
        <div className="absolute top-20 right-[10%] w-16 h-16 rounded-full bg-primary/5 animate-float"></div>
        <div className="absolute bottom-32 left-[15%] w-10 h-10 rounded-full bg-primary/10 animate-pulse-slow"></div>
      </div>
      
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <div>
            <AnimatedElement animation="fade-in">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
                Get In Touch
              </span>
            </AnimatedElement>
            
            <AnimatedElement animation="fade-in" delay={200}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                We'd Love to Hear From You
              </h2>
            </AnimatedElement>
            
            <AnimatedElement animation="fade-in" delay={400}>
              <p className="text-lg text-foreground/80 mb-8">
                Have questions about our products or need support? 
                Reach out to us and our team will be happy to assist you.
              </p>
            </AnimatedElement>
            
            <AnimatedElement animation="fade-in" delay={600}>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Our Location</h3>
                  <p className="text-foreground/80">
                    123 Audio Avenue, Sound District<br />
                    San Francisco, CA 94103
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Email Us</h3>
                  <p className="text-foreground/80">
                    info@asumansounds.com
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Call Us</h3>
                  <p className="text-foreground/80">
                    +1 (555) 123-4567
                  </p>
                </div>
              </div>
            </AnimatedElement>
          </div>
          
          <AnimatedElement animation="fade-in" delay={800}>
            <div className="glass-card p-8">
              <h3 className="text-xl font-semibold mb-6">Send Us a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting || submitted}
                  className={cn(
                    "w-full btn-primary flex items-center justify-center",
                    (isSubmitting || submitted) && "opacity-80"
                  )}
                >
                  {isSubmitting ? (
                    <span>Sending...</span>
                  ) : submitted ? (
                    <span className="flex items-center">
                      <Check size={18} className="mr-2" /> Sent!
                    </span>
                  ) : (
                    <span>Send Message</span>
                  )}
                </button>
              </form>
            </div>
          </AnimatedElement>
        </div>
      </div>
    </section>
  );
};

export default Contact;
