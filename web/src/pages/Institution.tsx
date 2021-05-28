import "../styles/Table.css";

import {
  InputAdornment,
  TextField,
  makeStyles,
  useTheme,
} from "@material-ui/core";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { faEdit, faKeyboard } from "@fortawesome/free-regular-svg-icons";

import Button from "../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FormErrorMessage from "../components/FormErrorMessage";
import { useForm } from "react-hook-form";

type Address = {
  street: string;
  streetNumber: number;
  zipCode: number;
  town: string;
};

type InstitutionType = {
  instCode: string;
  name: string;
  address: Address;
  phoneNumber: number;
  schoolAdministrativeDistrict: boolean;
};

const useButtonStyles = makeStyles({
  button: {
    display: "flex",
    justifyContent: "center",
    marginTop: "2em",
    padding: "0.5em 10%",
  },
});

const useInputStyles = makeStyles({
  input: {
    margin: "0.5em",
    width: "30vw",
    minWidth: "200px",
    maxWidth: "350px",
    fontSize: "1em",
    fontFamily: "inherit",
    "& .MuiInput-underline:hover:not(.Mui-disabled)::before": {
      borderColor: "var(--border)",
      borderWidth: "1.5px",
    },
    "& .MuiInput-underline:after": {
      transitionDuration: "300ms",
    },
  },
});

export default function Institution() {
  return <Outlet />;
}

export function CreateInstitution() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InstitutionType>({ mode: "onChange" });
  const formInput = useInputStyles();
  const formButton = useButtonStyles();
  const theme = useTheme();

  return (
    <div className="container">
      <form
        onSubmit={handleSubmit((data) => {
          console.log(data);
        })}
      >
        <label>
          {errors.instCode && (
            <FormErrorMessage message={errors.instCode.message} />
          )}
          <TextField
            placeholder="INST-Code"
            type="text"
            className={formInput.input}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FontAwesomeIcon className="inputIcon" icon={faKeyboard} />
                </InputAdornment>
              ),
              ...register("instCode", {
                required: "INST-Code muss angegeben werden",
              }),
            }}
            autoFocus
          />
        </label>
        <label>
          {errors.name && <FormErrorMessage message={errors.name.message} />}
          <TextField
            placeholder="Name"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FontAwesomeIcon className="inputIcon" icon={faEdit} />
                </InputAdornment>
              ),
              ...register("name", {
                required: "Name der Institution muss angegeben werden",
              }),
            }}
            type="text"
          />
        </label>
        <label>
          {errors.phoneNumber && (
            <FormErrorMessage message={errors.phoneNumber.message} />
          )}
          <TextField
            placeholder="Telefonnummer"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FontAwesomeIcon className="inputIcon" icon={faEdit} />
                </InputAdornment>
              ),
              ...register("phoneNumber", {
                required: "Telefonnummer muss angegeben werden",
                pattern: {
                  value: /^[0-9\s-/]+$/,
                  message: "Telefonnummer nur aus Zahlen",
                },
              }),
            }}
            type="tel"
          />
        </label>
        <label>
          {errors.address?.street && (
            <FormErrorMessage message={errors.address.street.message} />
          )}
          <TextField
            placeholder="Straße"
            type="text"
            className={formInput.input}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FontAwesomeIcon className="inputIcon" icon={faEdit} />
                </InputAdornment>
              ),
              ...register("address.street", {
                required: "Straße muss angegeben werden",
              }),
            }}
          />
        </label>
        <div className="halfstuff">
          <label className="half">
            {errors.address?.zipCode && (
              <FormErrorMessage message={errors.address.zipCode.message} />
            )}
            <TextField
              placeholder="Postleitzahl"
              type="tel"
              className={formInput.input}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FontAwesomeIcon className="inputIcon" icon={faEdit} />
                  </InputAdornment>
                ),
                ...register("address.zipCode", {
                  required: "Postleitzahl muss angegeben werden",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Was denn bei deiner Postleitzahl los?!",
                  },
                }),
              }}
            />
          </label>
          <label className="half">
            {errors.address?.town && (
              <FormErrorMessage message={errors.address.town.message} />
            )}
            <TextField
              placeholder="Stadt"
              type="text"
              className={formInput.input}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FontAwesomeIcon className="inputIcon" icon={faEdit} />
                  </InputAdornment>
                ),
                ...register("address.town", {
                  required: "Ort muss angegeben werden",
                }),
              }}
            />
          </label>
        </div>
        <Button
          type="submit"
          label="Weiter"
          buttonStyle={formButton}
          textColor="white"
          backgroundColor={theme.palette.primary.main}
        />
      </form>
    </div>
  );
}

const institutions: Array<InstitutionType> = [
  {
    address: {
      street: "blub",
      streetNumber: 42,
      town: "bla",
      zipCode: 31415,
    },
    instCode: "GI1234blub",
    name: "name",
    phoneNumber: 123456789,
    schoolAdministrativeDistrict: true,
  },
  {
    address: {
      street: "blub",
      streetNumber: 42,
      town: "bla",
      zipCode: 31415,
    },
    instCode: "GI56789blubjfg",
    name: "name",
    phoneNumber: 123456789,
    schoolAdministrativeDistrict: true,
  },
];

export function Institutions() {
  const navigate = useNavigate();
  const tableHeaders = [
    "INST-Code",
    "Name",
    "Straße",
    "Hausnummer",
    "Stadt",
    "PLZ",
    "Telefonnummer",
    "Schulverwaltungsbezirk",
  ];

  return (
    <>
      <div className="container">
        <table>
          <thead>
            <tr>
              {tableHeaders.map((header) => (
                <th>{header}</th>
              ))}
            </tr>
          </thead>
          {institutions.map((institution) => {
            return (
              <tbody>
                <tr
                  className="link"
                  key={institution.instCode}
                  onClick={() => {
                    console.log("click", institution.instCode);
                    navigate("./".concat(institution.instCode));
                  }}
                >
                  <td>{institution.instCode}</td>
                  <td>{institution.name}</td>
                  <td>{institution.address.street}</td>
                  <td>{institution.address.streetNumber}</td>
                  <td>{institution.address.town}</td>
                  <td>{institution.address.zipCode}</td>
                  <td>{institution.phoneNumber}</td>
                  <td>
                    {institution.schoolAdministrativeDistrict ? "Ja" : "Nein"}
                  </td>
                </tr>
              </tbody>
            );
          })}
        </table>
      </div>
    </>
  );
}

export function ViewDetails() {
  let { instCode } = useParams();
  // GET and stuff
  return (
    <div>
      <InstitutionOverlay />
    </div>
  );
}

export function InstitutionOverlay() {
  return <div>asdf</div>;
}
