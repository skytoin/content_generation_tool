/**
 * GENERATION THEATER - UI Concepts
 *
 * This folder contains 5 different UI variants for the generation experience.
 * The feature is OFF by default and can only be enabled by admins.
 *
 * VARIANTS:
 * 1. Minimal Elegant - Clean, Notion-like, focused on content
 * 2. Cinematic - Rich visual feedback, dark mode, premium feel
 * 3. Technical - Developer-friendly, terminal aesthetic, stats visible
 * 4. Ambient - Abstract, artistic, meditative experience
 * 5. Cards - Clear stage-by-stage progress, light mode friendly
 *
 * HOW TO USE:
 *
 * 1. Create a demo route to preview all variants:
 *    app/demo/generation-theater/page.tsx
 *
 * 2. Use the admin toggle in your admin dashboard:
 *    import { TheaterAdminToggle, useTheaterConfig } from './AdminToggle';
 *
 * 3. In your generation page, conditionally render:
 *    const { config } = useTheaterConfig();
 *    if (config.enabled) {
 *      return <CinematicTheater {...props} />;
 *    }
 *    return <StandardLoadingSpinner />;
 *
 * IMPORTANT:
 * - Feature is OFF by default
 * - Only admins can toggle it on
 * - Customers see standard loading unless admin enables it
 */

// Types
export * from './types';

// Variants
export { MinimalTheater } from './Variant1-Minimal';
export { CinematicTheater } from './Variant2-Cinematic';
export { TechnicalTheater } from './Variant3-Technical';
export { AmbientTheater } from './Variant4-Ambient';
export { CardsTheater } from './Variant5-Cards';

// Admin controls
export { TheaterAdminToggle, useTheaterConfig } from './AdminToggle';

// Demo page component
export { GenerationTheaterDemo } from './DemoPage';
