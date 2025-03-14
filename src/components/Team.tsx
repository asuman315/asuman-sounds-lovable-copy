
import AnimatedElement from "./AnimatedElement";

const TeamMember = ({
  name,
  role,
  imageSrc,
  delay,
}: {
  name: string;
  role: string;
  imageSrc: string;
  delay: number;
}) => {
  return (
    <AnimatedElement animation="fade-in" delay={delay} className="flex flex-col">
      <div className="aspect-square mb-4 bg-gradient-to-br from-secondary to-secondary/50 rounded-2xl overflow-hidden relative">
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900/70 to-gray-900/60 text-white text-4xl font-bold">
          {name.charAt(0)}
        </div>
      </div>
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-foreground/70 text-sm">{role}</p>
    </AnimatedElement>
  );
};

const Team = () => {
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      imageSrc: "/placeholder.svg",
    },
    {
      name: "David Chen",
      role: "Chief Audio Engineer",
      imageSrc: "/placeholder.svg",
    },
    {
      name: "Maria Rodriguez",
      role: "Design Director",
      imageSrc: "/placeholder.svg",
    },
    {
      name: "James Wilson",
      role: "Product Manager",
      imageSrc: "/placeholder.svg",
    },
  ];

  return (
    <section id="team" className="py-20 md:py-32 bg-secondary/30 relative overflow-hidden">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <AnimatedElement animation="fade-in">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
              Our Team
            </span>
          </AnimatedElement>
          
          <AnimatedElement animation="fade-in" delay={200}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              The Minds Behind the Sound
            </h2>
          </AnimatedElement>
          
          <AnimatedElement animation="fade-in" delay={400}>
            <p className="text-lg text-foreground/80">
              Our team of audio experts, designers, and engineers work together to create 
              products that redefine how we experience sound.
            </p>
          </AnimatedElement>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {teamMembers.map((member, index) => (
            <TeamMember
              key={index}
              name={member.name}
              role={member.role}
              imageSrc={member.imageSrc}
              delay={index * 150 + 600}
            />
          ))}
        </div>

        <AnimatedElement animation="fade-in" delay={1200} className="mt-20">
          <div className="glass-card p-8 md:p-12 max-w-4xl mx-auto">
            <blockquote className="text-xl md:text-2xl font-medium text-foreground/90 italic text-center mb-6">
              "Our mission is to create audio products that deliver both exceptional 
              sound quality and timeless design."
            </blockquote>
            <div className="text-center">
              <p className="font-semibold">Sarah Johnson</p>
              <p className="text-foreground/70 text-sm">Founder & CEO</p>
            </div>
          </div>
        </AnimatedElement>
      </div>
    </section>
  );
};

export default Team;
