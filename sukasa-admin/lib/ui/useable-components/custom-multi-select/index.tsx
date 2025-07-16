// Interface
import { IMultiSelectComponentProps } from '@/lib/utils/interfaces';

// Prime React
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import InputSkeleton from '../custom-skeletons/inputfield.skeleton';
import TextIconClickable from '../text-icon-clickable';
import { faAdd } from '@fortawesome/free-solid-svg-icons';

const CustomMultiSelectComponent = ({
  name,
  placeholder,
  options,
  selectedItems,
  extraFooterButton,
  setSelectedItems,
  showLabel,
  dropDownIcon,
  isLoading = false,
  onChange,
  ...props
}: IMultiSelectComponentProps) => {
  const itemTemplate = (option: { label: string }) => {
    return (
      <div className="align-items-center flex">
        <div>{option.label}</div>
      </div>
    );
  };

  const panelFooterTemplate = () => {
    const length = selectedItems ? selectedItems.length : 0;

    return (
      <div className="flex justify-between space-x-2">
        {extraFooterButton?.title ? (
          <TextIconClickable
            className="w-full h-fit rounded  text-black"
            icon={faAdd}
            iconStyles={{ color: 'black' }}
            title={`${extraFooterButton.title} (${length} Selected)`}
            onClick={extraFooterButton.onChange}
          />
        ) : (
          <div className="px-3 py-2">
            <b>{length}</b> item{length > 1 ? 's' : ''} selected.
          </div>
        )}
      </div>
    );
  };

  return !isLoading ? (
    <div className={`flex w-full flex-col justify-center gap-y-1`}>
      {showLabel && (
        <label htmlFor="username" className="text-sm font-[500]">
          {placeholder}
        </label>
      )}

      <MultiSelect
        value={selectedItems}
        options={options}
        onChange={(e: MultiSelectChangeEvent) => {
          if (onChange) {
            // for custom cases: i.e conditional selecting
            onChange(e.value);
          } else setSelectedItems(name, e.value);
        }}
        optionLabel="label"
        placeholder={placeholder}
        itemTemplate={itemTemplate}
        panelFooterTemplate={panelFooterTemplate}
        className="md:w-20rem m-0 h-10 w-full border border-gray-300 p-0 align-middle text-sm focus:shadow-none focus:outline-none"
        panelClassName="border-gray-200 border-2"
        display="chip"
        dropdownIcon={(options) => (
          <FontAwesomeIcon icon={dropDownIcon ?? faChevronDown} {...options} />
        )}
        filter={true}
        {...props}
      />
    </div>
  ) : (
    <InputSkeleton />
  );
};

export default CustomMultiSelectComponent;
