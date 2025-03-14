
import { Headphones, Speaker, Volume2, Zap } from "lucide-react";
import AnimatedElement from "./AnimatedElement";

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  delay: number;
}) => {
  return (
    <AnimatedElement
      animation="fade-in"
      delay={delay}
      className="glass-card p-6 flex flex-col items-center sm:items-start text-center sm:text-left"
    >
      <div className="mb-4 p-3 rounded-full bg-primary/10 text-primary">
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-foreground/80">{description}</p>
    </AnimatedElement>
  );
};

const Features = () => {
  const features = [
    {
      icon: Headphones,
      title: "Premium Audio",
      description:
        "Experience crystal clear sound with our high-fidelity audio technology designed for audiophiles.",
    },
    {
      icon: Speaker,
      title: "Elegant Design",
      description:
        "Precision-crafted with premium materials that blend seamlessly with any space.",
    },
    {
      icon: Zap,
      title: "Long Battery Life",
      description:
        "Enjoy up to 36 hours of continuous playtime with our energy-efficient technology.",
    },
    {
      icon: Volume2,
      title: "Noise Cancellation",
      description:
        "Advanced algorithms that isolate your audio experience from external distractions.",
    },
  ];

  return (
    <section id="features" className="py-20 md:py-32 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 to-transparent opacity-50"></div>
      
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <AnimatedElement animation="fade-in">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
              Superior Features
            </span>
          </AnimatedElement>
          
          <AnimatedElement animation="fade-in" delay={200}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Crafted with Attention to Detail
            </h2>
          </AnimatedElement>
          
          <AnimatedElement animation="fade-in" delay={400}>
            <p className="text-lg text-foreground/80">
              Every Asuman product is designed with precision and care, focusing on both
              aesthetics and functionality.
            </p>
          </AnimatedElement>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 150 + 600}
            />
          ))}
        </div>

        <AnimatedElement animation="fade-in" delay={1200} className="mt-20">
          <div className="relative mx-auto max-w-5xl rounded-2xl overflow-hidden">
            <div className="aspect-[21/9] bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between">
              <div className="text-white max-w-md text-center md:text-left mb-8 md:mb-0">
                <span className="inline-block text-xs font-medium tracking-wider text-primary/80 mb-2">
                  FEATURED PRODUCT
                </span>
                <h3 className="text-2xl md:text-3xl font-bold mb-3">
                  Asuman X7 Pro
                </h3>
                <p className="text-white/70 mb-6">
                  Our flagship wireless headphones with industry-leading noise cancellation and premium sound quality.
                </p>
                <button className="btn-primary bg-white text-gray-900 hover:bg-white/90">
                  Learn More
                </button>
              </div>
              
              <div className="w-48 h-48 md:w-56 md:h-56 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full animate-pulse-slow"></div>
                <div className="absolute inset-4 bg-black rounded-full"></div>
                <div className="absolute inset-[18px] border-2 border-white/10 rounded-full"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">X7</span>
                </div>
              </div>
            </div>
            <div className="absolute bottom-4 right-4 glass-card py-2 px-4 text-foreground/90 font-medium text-sm">
              New Release
            </div>
          </div>
        </AnimatedElement>
      </div>
    </section>
  );
};

export default Features;
