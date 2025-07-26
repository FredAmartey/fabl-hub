# Fabl.tv Design System

## Overview

The Fabl.tv design system is built around a dark, futuristic aesthetic with purple and blue gradient accents. It emphasizes modern AI-generated content while maintaining excellent usability and accessibility.

## Color System

### Core Colors

#### Background Colors
- **Primary Background**: `#0f0a1e` - Deep dark purple, used for main app background
- **Secondary Background**: `#1a1230` - Slightly lighter purple, used for cards and surfaces
- **Tertiary Background**: `#241a38` - Hover states and elevated surfaces
- **Sidebar Background**: `#120c24` - Darker variant for navigation

#### Accent Colors
- **Primary Purple**: `#9333ea` (purple-600)
- **Primary Blue**: `#3b82f6` (blue-500)
- **Gradient**: `from-purple-600 to-blue-500` - Used for CTAs and highlights

#### Semantic Colors
- **Success**: `#10b981` (green-400)
- **Error**: `#ef4444` (red-400)
- **Warning**: `#f59e0b` (yellow-400)
- **Info**: `#3b82f6` (blue-400)

#### Category Colors
- **Film & TV**: `#f87171` (red-400)
- **Music**: `#ec4899` (pink-400)
- **Gaming**: `#10b981` (green-400)
- **Podcasts**: `#06b6d4` (cyan-400)
- **VTubers**: `#8b5cf6` (violet-400)
- **Art**: `#fb923c` (orange-400)
- **Brands**: `#a78bfa` (purple-400)
- **Comedy**: `#fbbf24` (yellow-400)
- **Tutorials**: `#60a5fa` (blue-400)

### Transparency & Effects
- **Glass Effect**: `bg-[#0f0a1e]/80 backdrop-blur-md`
- **Border Accent**: `border-purple-500/20` or `border-purple-500/30`
- **Shadow**: `shadow-purple-500/20`
- **Overlay**: `bg-black/70` or `bg-black/80`

## Typography

### Font Families
- **Primary Font**: Inter - Used for UI elements and body text
- **Brand Font**: Afacad - Used for logo and headings
- **Monospace**: System default - For code blocks

### Font Sizes
- **Text XS**: `text-xs` (12px)
- **Text SM**: `text-sm` (14px) - Default for UI
- **Text Base**: `text-base` (16px) - Body text
- **Text LG**: `text-lg` (18px)
- **Text XL**: `text-xl` (20px)
- **Text 2XL**: `text-2xl` (24px)
- **Text 3XL**: `text-3xl` (30px) - Logo

### Font Weights
- **Regular**: `font-normal` (400)
- **Medium**: `font-medium` (500) - Primary UI text
- **Bold**: `font-bold` (700) - Headings

### Text Colors
- **Primary**: `text-white`
- **Secondary**: `text-gray-300`
- **Muted**: `text-gray-400`
- **Subtle**: `text-gray-500`
- **Accent**: `text-purple-400` or gradient text

## Spacing System

### Base Unit: 4px (0.25rem)
- **1**: 4px (0.25rem)
- **2**: 8px (0.5rem)
- **3**: 12px (0.75rem)
- **4**: 16px (1rem)
- **6**: 24px (1.5rem)
- **8**: 32px (2rem)
- **10**: 40px (2.5rem)
- **12**: 48px (3rem)

## Component Library

### Button Component

#### Variants
1. **Default**: Dark background with hover state
   ```
   bg-[#1a1230] hover:bg-[#241a38] text-white
   ```

2. **Primary**: Gradient background with shadow
   ```
   bg-gradient-to-r from-purple-600 to-blue-500
   hover:from-purple-700 hover:to-blue-600
   shadow-md hover:shadow-lg shadow-purple-500/20
   ```

3. **Ghost**: Transparent with subtle hover
   ```
   bg-transparent hover:bg-purple-500/10
   text-gray-300 hover:text-white
   ```

4. **Outline**: Border with transparent background
   ```
   border border-purple-500/30 hover:border-purple-500
   hover:bg-purple-500/10
   ```

#### Sizes
- **Small**: `h-8 px-3 py-1 rounded-md text-xs`
- **Default**: `h-10 px-4 py-2 rounded-lg text-sm`
- **Large**: `h-12 px-6 py-3 rounded-lg text-base`
- **Icon**: `h-10 w-10 rounded-full`

### Card Components

#### VideoCard Pattern
- **Container**: Rounded corners, hover effects
  ```
  rounded-xl overflow-hidden bg-[#1a1230]
  hover:bg-[#241a38] hover:scale-105
  hover:shadow-lg hover:shadow-purple-500/20
  ```
- **Thumbnail**: Aspect ratio with hover zoom
  ```
  aspect-video overflow-hidden
  hover:scale-110 transition-transform duration-700
  ```
- **Progress Bar**: Bottom gradient indicator
  ```
  h-1 bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600
  transform scale-x-0 group-hover:scale-x-100
  ```

### Navigation Patterns

#### Sidebar Navigation
- **Width**: Collapsible (56px to 224px)
- **Item States**:
  - Default: `hover:bg-purple-500/10`
  - Active: `bg-purple-500/20 border-l-4 border-purple-500`
- **Icons**: 20x20px with category-specific colors

#### Header
- **Height**: 64px
- **Style**: Glass morphism with sticky positioning
- **Search**: Expandable with suggestions dropdown

### Interactive Elements

#### Hover Effects
- **Scale**: `hover:scale-105` or `hover:scale-110`
- **Color Transitions**: `transition-colors duration-200`
- **Shadow Elevation**: `hover:shadow-lg hover:shadow-purple-500/20`

#### Focus States
- **Ring**: `focus:ring-2 focus:ring-purple-500/50`
- **Outline**: `focus:outline-none`

#### Transitions
- **Fast**: `duration-75` - Immediate feedback
- **Default**: `duration-200` - Standard interactions
- **Smooth**: `duration-300` - Subtle animations
- **Slow**: `duration-700` - Dramatic effects

### Layout Patterns

#### Grid Systems
- **Video Grid**: Responsive columns
  ```
  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
  gap-6
  ```

#### Containers
- **Max Width**: `max-w-7xl mx-auto`
- **Padding**: `px-4` mobile, `px-6` desktop

## Animation Guidelines

### Micro-animations
- **Pulse**: Logo sparkle effect
  ```
  animate-pulse
  ```
- **Transform**: Scale and rotate on hover
- **Opacity**: Fade in/out for overlays

### Loading States
- **Skeleton**: Use gradient shimmer effect
- **Spinner**: Purple gradient rotation

## Accessibility

### Color Contrast
- Maintain WCAG AA compliance
- Primary text on dark backgrounds: #FFFFFF
- Secondary text: #D1D5DB (gray-300)

### Focus Management
- Visible focus rings on all interactive elements
- Keyboard navigation support
- Touch-friendly tap targets (min 44x44px)

### Motion
- Respect `prefers-reduced-motion`
- Provide alternatives to motion-based interactions

## Implementation Examples

### Creating a New Component
```tsx
// Follow existing patterns
export function NewComponent() {
  return (
    <div className="rounded-xl bg-[#1a1230] p-4 hover:bg-[#241a38] transition-colors">
      <h3 className="text-lg font-medium mb-2">Title</h3>
      <p className="text-gray-400 text-sm">Description</p>
      <Button variant="primary" className="mt-4">
        Action
      </Button>
    </div>
  );
}
```

### Using the Color System
```tsx
// Backgrounds
<div className="bg-[#0f0a1e]">Main background</div>
<div className="bg-[#1a1230]">Card background</div>

// Gradients
<div className="bg-gradient-to-r from-purple-600 to-blue-500">
  Gradient element
</div>

// Glass effects
<div className="bg-[#0f0a1e]/80 backdrop-blur-md">
  Glass morphism
</div>
```

## Best Practices

1. **Consistency**: Always use the defined color palette and spacing system
2. **Hierarchy**: Use size, weight, and color to establish visual hierarchy
3. **Feedback**: Provide immediate visual feedback for all interactions
4. **Performance**: Use CSS transitions instead of JavaScript animations
5. **Responsive**: Design mobile-first with progressive enhancement
6. **Dark Mode**: The app is dark-mode only, optimize for low-light viewing

## Future Considerations

- Component variations for different content types
- Enhanced animation library
- Accessibility improvements
- Performance optimizations for large datasets
- Extended icon library for AI-specific features