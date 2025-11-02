export const RESUME_TEMPLATES = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and contemporary design with bold headers',
    primaryColor: 'hsl(195 85% 55%)',
    accentColor: 'hsl(15 85% 65%)',
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Traditional layout perfect for corporate roles',
    primaryColor: 'hsl(220 85% 50%)',
    accentColor: 'hsl(220 60% 35%)',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Eye-catching design for creative professionals',
    primaryColor: 'hsl(280 85% 60%)',
    accentColor: 'hsl(340 85% 65%)',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and elegant with plenty of white space',
    primaryColor: 'hsl(0 0% 20%)',
    accentColor: 'hsl(0 0% 40%)',
  },
] as const;

export type TemplateId = typeof RESUME_TEMPLATES[number]['id'];
