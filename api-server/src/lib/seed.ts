import { User } from "../models/User";
import { Service } from "../models/Service";
import { Project } from "../models/Project";
import { Review } from "../models/Review";
import { logger } from "./logger";

export async function seedDatabase(): Promise<void> {
  const count = await User.countDocuments();
  if (count > 0) {
    logger.info("Database already has data — skipping seed");
    return;
  }

  logger.info("Seeding database with initial data...");

  const [admin, provider1, provider2, customer1, customer2] = await User.create([
    { name: "Alice Smith", email: "admin@servicehub.com", password: "admin123", role: "admin", avatar: "https://i.pravatar.cc/150?img=1" },
    { name: "Carlos Rivera", email: "carlos@servicehub.com", password: "provider123", role: "provider", avatar: "https://i.pravatar.cc/150?img=3", location: "New York, USA", bio: "Full-stack developer with 8 years of experience building scalable web applications." },
    { name: "Priya Patel", email: "priya@servicehub.com", password: "provider123", role: "provider", avatar: "https://i.pravatar.cc/150?img=5", location: "Austin, TX", bio: "Creative designer specializing in brand identity and UI/UX design." },
    { name: "James Lee", email: "james@servicehub.com", password: "customer123", role: "customer", avatar: "https://i.pravatar.cc/150?img=8", location: "Chicago, IL" },
    { name: "Sofia Martinez", email: "sofia@servicehub.com", password: "customer123", role: "customer", avatar: "https://i.pravatar.cc/150?img=9", location: "Miami, FL" },
  ]);

  const [svc1, svc2, svc3, svc4] = await Service.create([
    {
      providerId: provider1._id,
      title: "Full-Stack Web Application Development",
      description: "I will build a complete web application with React frontend and Node.js backend, including database design, API development, authentication, and deployment.",
      category: "Website Development",
      price: 500,
      deliveryDays: 14,
      image: "https://picsum.photos/seed/web1/400/250",
      tags: ["React", "Node.js", "MongoDB", "Full Stack"],
      isPopular: true,
      rating: 4.9,
      reviewCount: 24,
    },
    {
      providerId: provider1._id,
      title: "Mobile App Development (React Native)",
      description: "I will develop a cross-platform mobile application using React Native that works on both iOS and Android.",
      category: "Mobile Development",
      price: 800,
      deliveryDays: 21,
      image: "https://picsum.photos/seed/mobile1/400/250",
      tags: ["React Native", "iOS", "Android", "Cross-Platform"],
      isPopular: false,
      rating: 4.7,
      reviewCount: 12,
    },
    {
      providerId: provider2._id,
      title: "Professional Logo & Brand Identity Design",
      description: "I will create a professional logo and complete brand identity package including color palette, typography, and brand guidelines.",
      category: "Logo Design",
      price: 150,
      deliveryDays: 5,
      image: "https://picsum.photos/seed/logo1/400/250",
      tags: ["Logo", "Branding", "Adobe Illustrator", "Identity"],
      isPopular: true,
      rating: 4.8,
      reviewCount: 38,
    },
    {
      providerId: provider2._id,
      title: "SEO Audit & Optimization Strategy",
      description: "I will conduct a comprehensive SEO audit of your website and provide an actionable optimization strategy to improve your search rankings.",
      category: "SEO & Marketing",
      price: 200,
      deliveryDays: 7,
      image: "https://picsum.photos/seed/seo1/400/250",
      tags: ["SEO", "Google Analytics", "Keywords", "On-Page"],
      isPopular: false,
      rating: 4.6,
      reviewCount: 19,
    },
  ]);

  const [proj1] = await Project.create([
    {
      customerId: customer1._id,
      providerId: provider1._id,
      serviceId: svc1._id,
      title: "E-commerce Platform for Boutique Shop",
      requirements: "Need a full e-commerce platform with product management, shopping cart, and Stripe payments.",
      budget: 650,
      deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      status: "Delivered",
      statusHistory: [
        { status: "Pending", changedAt: new Date(Date.now() - 30 * 86400000) },
        { status: "Accepted", changedAt: new Date(Date.now() - 25 * 86400000) },
        { status: "In Progress", changedAt: new Date(Date.now() - 20 * 86400000) },
        { status: "Completed", changedAt: new Date(Date.now() - 5 * 86400000) },
        { status: "Delivered", changedAt: new Date(Date.now() - 2 * 86400000) },
      ],
    },
    {
      customerId: customer2._id,
      providerId: provider2._id,
      serviceId: svc3._id,
      title: "Startup Brand Identity",
      requirements: "Need a complete brand identity for our fintech startup. Modern, trustworthy, professional.",
      budget: 200,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: "In Progress",
      statusHistory: [
        { status: "Pending", changedAt: new Date(Date.now() - 5 * 86400000) },
        { status: "Accepted", changedAt: new Date(Date.now() - 4 * 86400000) },
        { status: "In Progress", changedAt: new Date(Date.now() - 2 * 86400000) },
      ],
    },
  ]);

  await Review.create([
    {
      serviceId: svc1._id,
      projectId: proj1._id,
      customerId: customer1._id,
      providerId: provider1._id,
      rating: 5,
      comment: "Absolutely fantastic work! Carlos delivered exactly what we needed and even added extra features. Highly recommended!",
    },
  ]);

  logger.info("Database seeded successfully");
  logger.info("Demo accounts:");
  logger.info("  Admin:    admin@servicehub.com / admin123");
  logger.info("  Provider: carlos@servicehub.com / provider123");
  logger.info("  Provider: priya@servicehub.com / provider123");
  logger.info("  Customer: james@servicehub.com / customer123");
  logger.info("  Customer: sofia@servicehub.com / customer123");
}
