import {
  faCheck,
  faExclamationTriangle,
  faInfoCircle,
  faXmarkCircle,
} from '@fortawesome/free-solid-svg-icons';
import { ISeverityStyles } from '../interfaces/toast.interface';

// Prices
export const MIN_PRICE = 0.0;
export const MAX_PRICE = 99999;

// File Sizes
export const MAX_LANSDCAPE_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
export const MAX_SQUARE_FILE_SIZE = 500 * 1000; // 500 KB
export const MAX_VIDEO_FILE_SIZE = 8 * 1024 * 1024; // 8 MB

// Default Locale
export const DEFAULT_LOCALE: string = 'en';

// Severity Styles
export const SEVERITY_STYLES: ISeverityStyles = {
  error: {
    bgColor: '#FFC5C5',
    textColor: '#FF0000',
    icon: faXmarkCircle,
    iconBg: '#FFC5C5',
  },
  success: {
    bgColor: '#C6F7D0',
    textColor: '#34C759',
    icon: faCheck,
    iconBg: '#C6F7D0',
  },
  info: {
    bgColor: '#B2E2FC',
    textColor: '#2196F3',
    icon: faInfoCircle,
    iconBg: '#B2E2FC',
  },
  warn: {
    bgColor: '#F7DC6F',
    textColor: '#F7DC6F',
    icon: faExclamationTriangle,
    iconBg: '#F7DC6F',
  },
};
