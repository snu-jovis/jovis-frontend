import { useState, useEffect } from "react";
import Latex from "react-latex";
import "katex/dist/katex.min.css";

const JoinOrderCard = (props) => {
  var joinOrderParts = [],
    joinOrderArray = [],
    node = props.node;

  if (props.showJoinCard) {
    joinOrderParts =
      props.joinOrder.length > 0 ? props.joinOrder.split(",") : [];

    let joinOrderText = "";

    for (let i = 0; i < joinOrderParts.length; i += 2) {
      let firstTable = joinOrderParts[i].trim().replace(/\s+/g, " \\bowtie ");
      let secondTable = joinOrderParts[i + 1]
        .trim()
        .replace(/\s+/g, " \\bowtie ");

      joinOrderText += `\\rm{(${firstTable})} \\bowtie \\rm{${secondTable}}`;

      if (i + 2 >= joinOrderParts.length) {
        joinOrderText = `${joinOrderText}`;
      } else {
        joinOrderText += ", ";
      }
    }
    joinOrderArray.push(joinOrderText);
    if (node) node = node.split(" - ")[1];
  }

  const [runCostFormula, setRunCostFormula] = useState("");
  const [startupCostFormula, setStartupCostFormula] = useState("");

  useEffect(() => {
    if (node === "HashJoin") {
      setRunCostFormula("$O(N_{inner} + N_{outer})$");
      setStartupCostFormula("$O(N_{inner} + N_{outer})$");
    } else if (node === "MergeJoin") {
      setRunCostFormula("$O(N_{inner} + N_{outer})$");
      setStartupCostFormula(
        "$O(N_{outer}log_{2}(N_{outer}) + N_{inner}log_{2}(N_{inner}))$"
      );
    } else if (node === "NestLoop") {
      setRunCostFormula("$O(N_{inner} * N_{outer})$");
      setStartupCostFormula("$0$");
    }
  }, [node]);

  return (
    <>
      {props.showJoinCard && (
        <div>
          <div className="dp-join-order my-2">
            {props.joinOrder.length > 0 && (
              <div className="my-4">
                Join order:{" "}
                {joinOrderArray.map((joinOrder, i) => (
                  <Latex key={i} className="latex">
                    {`$${joinOrder}$`}
                  </Latex>
                ))}
              </div>
            )}
            <div>Total Cost: {props.totalCost}</div>
            <div>
              Startup Cost: {props.startupCost} / Run Cost:{" "}
              {(props.totalCost - props.startupCost).toFixed(2)}
            </div>
          </div>

          <div className="dp-cost-formula">
            {props.node.length > 0 && (
              <>
                <div>
                  <br />
                  Run cost for {node} = <Latex>{runCostFormula}</Latex>
                </div>
                <div>
                  Startup cost for {node} = <Latex>{startupCostFormula}</Latex>
                </div>
                <br />
                <Latex>{"$N_{outer}$"}</Latex> = # of tuples in the outer
                relation
                <br />
                <Latex>{"$N_{inner}$"}</Latex> = # of tuples in the inner
                relation
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default JoinOrderCard;
