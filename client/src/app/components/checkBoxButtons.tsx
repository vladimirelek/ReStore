import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { useState } from "react";

interface Props {
  items: string[];
  checked?: string[];
  onChange: (items: string[]) => void;
}
const CheckBox = ({ items, checked, onChange }: Props) => {
  const [checkedItems, setCheckedItems] = useState(checked || []);
  const handleChecked = (value: string) => {
    const currentIndex = checkedItems.findIndex((item) => item === value);
    let newChecked: string[] = [];
    if (currentIndex === -1) newChecked = [...checkedItems, value];
    else newChecked = checkedItems.filter((item) => item !== value);
    setCheckedItems(newChecked);
    onChange(newChecked);
  };
  return (
    <FormGroup>
      {items.map((brand) => (
        <FormControlLabel
          control={
            <Checkbox
              checked={checkedItems.indexOf(brand) !== -1}
              onClick={() => handleChecked(brand)}
            />
          }
          label={brand}
          key={brand}
        />
      ))}
    </FormGroup>
  );
};
export default CheckBox;
