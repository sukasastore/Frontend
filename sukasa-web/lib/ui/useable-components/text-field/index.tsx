// Interface
import { ITextComponentProps } from '@/lib/utils/interfaces';

export default function TextComponent({
  title,
  text,
  className,
}: ITextComponentProps) {
  return <div title={title} className={`custom-text ${className}`}>{text}</div>;
}
