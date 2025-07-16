// Constants
import { PasswordErrors } from '@/lib/utils/constants';
import { faDotCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function PasswordFeedback() {
  return (
    <div className="mt-2 flex flex-col gap-2 ">
      {PasswordErrors.map((pmessage, index) => {
        return (
          <div key={index} className="text-gray-500 text-sm">
            <FontAwesomeIcon icon={faDotCircle} className="mr-2" />
            <span>{pmessage}</span>
          </div>
        );
      })}
    </div>
  );
}
