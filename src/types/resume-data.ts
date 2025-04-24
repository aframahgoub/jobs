export interface ResumeData {
  user_id: string;
  firstname: string;
  lastname: string;
  fullname: string;
  title: string;
  bio: string;
  location: string;
  email: string;
  phone: string;
  website: string;
  specialistprofile: string;
  skills: string[];
  education: any[];
  experience: any[];
  socialmedia: any;
  attachments: any[];
  photo: string;
  cv_url: string;
  nationality: string;
  age: string;
  yearsofexperience: string;
  educationlevel: string;
  certifications: any[];
  portfolio_images: string[];
  [key: string]: any; // Index signature to allow string indexing
}
