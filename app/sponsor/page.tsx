import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Star,
  Users,
  TrendingUp,
  Gift,
  BarChart3,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import LogoCarousel from "@/components/ui/logo-carousel";

export default function SponsorPage() {
  const sponsorshipLevels = [
    {
      level: "Associate",
      benefits: ["Highlighted matchups", "Logo on sponsors page"],
      cost: "Share us with your community",
      icon: Users,
      color: "bg-accent",
      textColor: "text-accent-foreground",
    },
    {
      level: "Sponsor",
      benefits: [
        "Highlighted matchups",
        "Logo on sponsors page",
        "Social media mentions",
        "Exclusive merchandise",
        "Special in-app flair",
      ],
      cost: "$10/month",
      icon: TrendingUp,
      color: "bg-secondary",
      textColor: "text-secondary-foreground",
    },

    {
      level: "Partner",
      benefits: [
        "Logo on main page",
        "Dedicated blog post",
        "Social media shoutouts",
        "Exclusive merchandise",
        "Access to analytics",
        "Special in-app flair",
      ],
      cost: "Contact us for more info",
      icon: Star,
      color: "bg-primary",
      textColor: "text-primary-foreground",
    },
  ];

  const applicationSteps = [
    "Email us at Info@Club602.com",
    "Review of application by the sponsorship team",
    "Contract negotiation and agreement",
    "Payment processing",
    "Onboarding and sponsor benefits activation",
  ];

  const partnerBenefits = [
    "Brand/Logo placement on the main page with a link to the partner's website.",
    "Select matchups highlighted for the brand.",
    "Dedicated blog post on our website highlighting the sponsor.",
    "Multiple social media shoutouts across all our platforms.",
    "Exclusive Merch and in-app flair",
    "Access to basic analytics on user engagement. (We will NEVER sell our user's data)",
    "Opportunity to provide input for future development.",
  ];

  const sponsorBenefits = [
    "Brand/Logo placement on the sponsors page with a link to the sponsor's website.",
    "Select matchups highlighted for the brand.",
    "Social media mentions on our platforms.",
    "Exclusive Merch and in-app flair",
    "Opportunity to provide input for future development.",
  ];

  const associateBenefits = [
    "Brand/Logo placement on the sponsors page with a link to the associate's website.",
    "Select matchups highlighted for the brand.",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              ChainLink Sponsorship
            </h1>
            <p className="text-xl md:text-2xl leading-relaxed opacity-90">
              Partner with us to engage your community through innovative gaming
              experiences
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Mission Statement */}
        <Link
          href="/"
          className="mb-4 inline-flex items-center mt-6 px-6 py-3 rounded-lg bg-primary-foreground text-primary hover:bg-primary-foreground/90 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Return Home
        </Link>

        <Card className="mb-12">
          <CardContent className="pt-8">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-lg leading-relaxed text-foreground">
                Here at ChainLink, we believe that community drives everything
                we do. It is for that reason that we wanted to ensure that
                everyone would have a chance to make ChainLink part of their own
                circles by allowing even the smallest content creators and group
                leaders to utilize our in-game opportunities to engage with
                their followers.
              </p>
              <p className="text-lg leading-relaxed text-foreground mt-6">
                From the Squads team game, to featured matchups, ChainLink can
                become a part of blogs, podcasts, business outreach, and social
                clubs everywhere. Starting at the low price of{" "}
                <span className="font-bold text-primary">FREE</span>, we will
                work with you to find the best way to engage your target
                audience.{" "}
                <span className="font-bold">
                  ChainLink & Your Brand, growing together.
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mb-16 flex flex-col items-center">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Sponsors
          </h2>
          <LogoCarousel columnCount={3} />
        </div>

        {/* Sponsorship Levels */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Sponsorship Levels
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {sponsorshipLevels.map((level, index) => {
              const IconComponent = level.icon;
              return (
                <Card
                  key={index}
                  className="relative overflow-hidden hover:shadow-xl transition-shadow duration-300 border-border"
                >
                  <div className={`${level.color} h-2`}></div>
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                      <div
                        className={`p-3 rounded-full ${level.color} ${level.textColor}`}
                      >
                        <IconComponent className="w-6 h-6" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl text-foreground">
                      {level.level}
                    </CardTitle>
                    <CardDescription className="text-lg font-semibold text-muted-foreground">
                      {level.cost}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {level.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-start">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-foreground">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Application Process */}
        <Card className="mb-16 border-border">
          <CardHeader>
            <CardTitle className="text-3xl text-center text-foreground">
              Sponsorship Application Process
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-w-3xl mx-auto">
              <div className="space-y-6">
                {applicationSteps.map((step, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold mr-4">
                      {index + 1}
                    </div>
                    <p className="text-lg text-foreground pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sponsor Benefits Details */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Sponsor Benefits Details
          </h2>

          {/* Associate Level */}
          <Card className="mb-8 border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-accent-foreground" />
                <CardTitle className="text-2xl text-foreground">
                  Associate Level
                </CardTitle>
                <Badge
                  variant="secondary"
                  className="bg-accent text-accent-foreground"
                >
                  Community
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {associateBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-accent-foreground rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Sponsor Level */}
          <Card className="mb-8 border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-secondary-foreground" />
                <CardTitle className="text-2xl text-foreground">
                  Sponsor Level
                </CardTitle>
                <Badge
                  variant="secondary"
                  className="bg-secondary text-secondary-foreground"
                >
                  Standard
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {sponsorBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-secondary-foreground rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Partner Level */}
          <Card className="mb-8 border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Star className="w-6 h-6 text-primary" />
                <CardTitle className="text-2xl text-foreground">
                  Partner Level
                </CardTitle>
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary border-primary/20"
                >
                  Premium
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {partnerBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <Card className="bg-secondary/50 border-border">
          <CardHeader>
            <CardTitle className="text-3xl text-center text-foreground">
              Contact Information
            </CardTitle>
            <CardDescription className="text-center text-lg text-muted-foreground">
              Ready to partner with ChainLink? Get in touch with us today!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Mail className="w-6 h-6 text-primary" />
                <span className="text-xl font-semibold text-foreground">
                  For further inquiries, please contact:
                </span>
              </div>
              <Link
                href="mailto:info@club602.com"
                target="_blank"
                prefetch={false}
              >
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg"
                >
                  info@club602.com
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
