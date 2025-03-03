import { TextField } from "@mui/material";

export default function QuantityInput(props: any) {
  return (
    <div className="quantityInputWrapperDiv">
      <TextField
        inputProps={{ min: 1, max: 100000 }}
        size="small"
        type="number"
        style={{ width: 100 }}
        value={props.input}
        onChange={(e) => {
          props.inputHandler(e.target, e.target.value, props.productId);
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "&.MuiInputBase-root fieldset": {
              borderColor:
                "inherit"
            },
          },
        }}
      />
    </div>
  );
}