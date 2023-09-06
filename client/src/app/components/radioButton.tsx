import {
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
interface Props {
  options: any[];
  onChange: (event: any) => void;
  selectedValue: string;
}

const RadioButton = ({ options, selectedValue, onChange }: Props) => {
  return (
    <FormControl component="fieldset">
      <RadioGroup onChange={onChange} value={selectedValue}>
        {options.map(({ value, label }) => (
          <FormControlLabel
            control={<Radio />}
            label={label}
            key={value}
            value={value}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};
export default RadioButton;
