import {
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
  colors,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/store";
interface Props {
  subtotal?: number;
}
export default function BasketSummary({ subtotal }: Props) {
  const { basket } = useAppSelector((state) => state.basket);

  if (subtotal === undefined)
    subtotal =
      basket?.items.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
      ) ?? 0;

  const deliveryFee = subtotal / 10 > 1000 ? 0 : 500;

  return (
    <>
      <TableContainer component={Paper} variant={"outlined"}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell colSpan={4}>Subtotal</TableCell>
              <TableCell align="right">
                {(subtotal / 100).toFixed(2)}$
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={4}>Delivery fee*</TableCell>
              <TableCell align="right">
                {(deliveryFee / 100).toFixed(2)}$
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={4}>Total</TableCell>
              <TableCell align="right">
                {((subtotal + deliveryFee) / 100).toFixed(2)}$
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <span style={{ fontStyle: "italic" }}>
                  *Orders over $100 qualify for free delivery
                </span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
