import {
  faCaretDown,
  faCaretUp,
  faFileZipper,
  faSpinner,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import protocol, { ResourceType } from "@metacall/protocol/protocol";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { metacallBaseUrl } from "../../constants/URLs";
import usePLansAvailable from "../../customHooks/usePlansAvailable";
import { getModel, tableEnum } from "../../models";
import { setItems } from "../../redux/stores/stashes.store";
import Confirm from "../Confirm/Confirm";
import { MessageContext } from "../MessageStack/MessageStack";
import StashList from "../StashList/StashList";
import Bundle from "./utils/Bundler";
function StashBox() {
  const dispatch = useDispatch();
  const stashedKeysDB = useRef(getModel(tableEnum.STASHED_KEYS));
  const { addError, addSuccess } = useContext(MessageContext);
  const { stashedKeys } = useSelector((state) => state.stashes);
  const keyValueDB = useRef(getModel(tableEnum.RESPONSES));
  const [showConfirmation, setShowConfirmation] = useState(false);
  const metacallToken = useSelector((state) => state.env.METACALL_TOKEN);
  const [collection, setCollection] = useState([]);
  const deployable = stashedKeys.length > 0 && metacallToken !== "";
  const [isDeploying, setIsDeploying] = useState(false);
  const metacallApi = protocol(metacallToken, metacallBaseUrl);
  const {
    data: plansAvailable,
    isLoading: isPlanLoading,
    refetch,
    isRefetching,
  } = usePLansAvailable(metacallToken);
  const [selectedPlan, setSelectedPlan] = useState("Package");
  const [plansAreShown, setPlansAreShown] = useState(false);
  useEffect(() => {
    stashedKeysDB.current.get("keys").then((keys) => {
      dispatch(setItems(keys ?? []));
    });
  }, [dispatch]);

  useEffect(() => {
    async function getResponses() {
      const responses = await Promise.all(
        stashedKeys.map(async (key) => {
          const response = await keyValueDB.current.get(key);
          return [response, key];
        })
      );
      setCollection(responses);
    }
    getResponses();
  }, [stashedKeys]);

  useEffect(() => {
    if (plansAvailable) setSelectedPlan(plansAvailable?.[0]);
  }, [plansAvailable]);

  async function downloadBundle(collection) {
    const [generatedZipBlob, prefix] = await Bundle(collection,{
      name: "useFuse.js",
      language_id: "node",
      path: "node",
    });
    const url = URL.createObjectURL(generatedZipBlob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${prefix}.zip`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  async function deployItems(collection, plan) {
    const [generatedZipBlob, prefix] = await Bundle(collection, {
      name: "metacall",
      language_id: "node",
      path: ".",
    });

    setIsDeploying(true);
    try {
      const createData = await metacallApi.upload(prefix, generatedZipBlob);
      const env = [];
      await metacallApi.deploy(createData.id, env, plan, ResourceType.Package);
      addSuccess(`Deployed ${prefix} at ${plan} successfully`);
    } catch (err) {
      addError(err?.response?.data ?? err.message);
    }
    setIsDeploying(false);
  }

  function removeAll() {
    stashedKeysDB.current
      .add("keys", [])
      .then(() => {
        dispatch(setItems([]));
      })
      .catch((err) => {
        addError(err?.message ?? "Error clearing stash");
      });
  }

  return (
    <React.Fragment>
      <div className={"h-full w-1/4 primary-border p-2 flex flex-col"}>
        <div className="text-base flex font-semibold text-gray-600">
          <span>STASHED FUNCTIONS </span>
          <div className=" ml-auto flex gap-1 place-items-center">
            <FontAwesomeIcon
              icon={faSpinner}
              className={
                "ml-auto mr-3 animate-spin opacity-0" +
                (isDeploying ? "opacity-100" : "")
              }
            />
            <FontAwesomeIcon
              icon={faTrashAlt}
              className="ml-auto cursor-pointer"
              title="clear stash"
              onClick={() =>
                setShowConfirmation({
                  message: "Are you sure you want to clear stash?",
                  onOk: removeAll,
                  onCancel: () => {},
                })
              }
            />
            <FontAwesomeIcon
              icon={faFileZipper}
              className="ml-auto cursor-pointer"
              title="download file in zip"
              onClick={() => {
                downloadBundle(collection);
              }}
            />
          </div>
        </div>
        {!deployable ? (
          <p className="text-gray-400 text-xs mt-3 mb-3">
            Generate functions and add them to deploy
          </p>
        ) : null}

        <StashList fnList={collection} />
        <div
          className={
            !(
              isPlanLoading ||
              !Array.isArray(plansAvailable) ||
              plansAvailable.length === 0 ||
              isDeploying
            )
              ? "bg-slate-700 text-white font-bold rounded transition duration-300 ease-in-out mt-3 primary-border  cursor-pointer "
              : "bg-gray-300  text-white font-bold rounded mt-3"
          }
        >
          {!isPlanLoading &&
            Array.isArray(plansAvailable) &&
            plansAvailable.length > 0 &&
             (
              <React.Fragment>
                <div
                  className={
                    "flex items-center justify-center w-full " +
                    (plansAreShown ? "visible" : "hidden")
                  }
                >
                  <ul className="[&>*:nth-child(odd)]:bg-gray-800 bg-gray-700 w-full text-center">
                    {plansAvailable.map((plan, index) => {
                      return (
                        <li
                          key={index}
                          className={
                            selectedPlan === plan
                              ? "text-white  py-2 px-4 "
                              : "text-gray-400  py-2 px-4 "
                          }
                          onClick={() => {
                            setSelectedPlan(plan);
                            setPlansAreShown(false);
                          }}
                        >
                          {plan}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <hr className={plansAreShown ? "visible" : "hidden"} />
              </React.Fragment>
            )}
          <div className="flex">
            <button
              className={
                "flex items-center justify-center w-full py-2 px-4 rounded " +
                (!(
                  isPlanLoading ||
                  !Array.isArray(plansAvailable) ||
                  plansAvailable.length === 0 ||
                  !deployable ||
                  isDeploying
                )
                  ? "bg-black active:bg-slate-700"
                  : "bg-gray-300 text-black")
              }
              onClick={() => {
                setShowConfirmation({
                  message: "Are you sure you want to deploy these functions?",
                  onOk: () => {
                    deployItems(collection, selectedPlan);
                    refetch();
                  },
                  onCancel: () => {},
                });
              }}
              disabled={
                isPlanLoading ||
                !Array.isArray(plansAvailable) ||
                plansAvailable.length === 0 ||
                !deployable ||
                isDeploying
              }
            >
              {Array.isArray(plansAvailable) && plansAvailable.length === 0 ? (
                <span title="click escape button to see deployments">
                  NOT AVAILABLE{" "}
                </span>
              ) : (
                <span>DEPLOY</span>
              )}
            </button>

            <button
              className={
                "flex items-center  justify-center w-1/4 py-2 px-4 rounded " +
                (!(
                  isPlanLoading ||
                  !Array.isArray(plansAvailable) ||
                  plansAvailable.length === 0 ||
                  isDeploying
                )
                  ? "bg-black active:bg-slate-700"
                  : "bg-gray-300 text-black")
              }
              disabled={
                isPlanLoading ||
                !Array.isArray(plansAvailable) ||
                plansAvailable.length === 0 ||
                isDeploying ||
                isRefetching
              }
              onClick={() => setPlansAreShown(!plansAreShown)}
            >
              <FontAwesomeIcon
                icon={
                  isRefetching
                    ? faSpinner
                    : plansAreShown
                    ? faCaretDown
                    : faCaretUp
                }
                className={isRefetching ? "animate-spin" : ""}
              />
            </button>
          </div>
        </div>
      </div>
      <Confirm
        showPrompt={showConfirmation}
        setShowPrompt={setShowConfirmation}
      />
    </React.Fragment>
  );
}

export default StashBox;
