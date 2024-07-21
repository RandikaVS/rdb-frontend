import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';

import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';

import { countries } from 'src/assets/data';

import Iconify from 'src/components/iconify';
import { ADMIN_STATUS_OPTIONS } from 'src/_mock';

// ----------------------------------------------------------------------

export default function RHFAutocomplete({ name, label, type, helperText, placeholder, ...other }) {
  const { control, setValue } = useFormContext();

  const { multiple } = other;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        if (type === 'country') {
          return (
            <Autocomplete
              {...field}
              id={`autocomplete-${name}`}
              autoHighlight={!multiple}
              disableCloseOnSelect={multiple}
              onChange={(event, newValue) => setValue(name, newValue, { shouldValidate: true })}
              renderOption={(props, option) => {
                const country = getCountry(option);

                if (!country.label) {
                  return null;
                }

                return (
                  <li {...props} key={country.label}>
                    <Iconify
                      key={country.label}
                      icon={`circle-flags:${country.code?.toLowerCase()}`}
                      sx={{ mr: 1 }}
                    />
                    {country.label} ({country.code}) +{country.phone}
                  </li>
                );
              }}
              renderInput={(params) => {
                const country = getCountry(params.inputProps.value);

                const baseField = {
                  ...params,
                  label,
                  placeholder,
                  error: !!error,
                  helperText: error ? error?.message : helperText,
                  inputProps: {
                    ...params.inputProps,
                    autoComplete: 'new-password',
                  },
                };

                if (multiple) {
                  return <TextField {...baseField} />;
                }

                return (
                  <TextField
                    {...baseField}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment
                          position="start"
                          sx={{
                            ...(!country.code && {
                              display: 'none',
                            }),
                          }}
                        >
                          <Iconify
                            icon={`circle-flags:${country.code?.toLowerCase()}`}
                            sx={{ mr: -0.5, ml: 0.5 }}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                );
              }}
              renderTags={(selected, getTagProps) =>
                selected.map((option, index) => {
                  const country = getCountry(option);

                  return (
                    <Chip
                      {...getTagProps({ index })}
                      key={country.label}
                      label={country.label}
                      icon={<Iconify icon={`circle-flags:${country.code?.toLowerCase()}`} />}
                      size="small"
                      variant="soft"
                    />
                  );
                })
              }
              {...other}
            />
          );
        }

        if (type === 'status') {
          return (
            <Autocomplete
              {...field}
              id={name}
              autoHighlight={!multiple}
              disableCloseOnSelect={multiple}
              onChange={(event, newValue) => setValue(name, newValue, { shouldValidate: true })}
              renderOption={(props, option) => {
                const status = getStatus(option.value);

                if (!status.label) {
                  return null;
                }

                return (
                  <li {...props} key={status.value}>
                    <Iconify
                      key={status.value}
                      icon={`circle-flags:${status.value?.toLowerCase()}`}
                      sx={{ mr: 1 }}
                    />
                    {status.label} 
                  </li>
                );
              }}
              renderInput={(params) => {
                const status = getStatus(params.inputProps.value);

                const baseField = {
                  ...params,
                  label,
                  placeholder,
                  error: !!error,
                  helperText: error ? error?.message : helperText,
                  inputProps: {
                    ...params.inputProps,
                    autoComplete: 'new-password',
                  },
                };

                if (multiple) {
                  return <TextField {...baseField} />;
                }

                return (
                  <TextField
                    {...baseField}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment
                          position="start"
                          sx={{
                            ...(!status.value && {
                              display: 'none',
                            }),
                          }}
                        >
                          <Iconify
                            icon={`circle-flags:${status.value?.toLowerCase()}`}
                            sx={{ mr: -0.5, ml: 0.5 }}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                );
              }}
              renderTags={(selected, getTagProps) =>
                selected.map((option, index) => {
                  const status = getStatus(option.value);

                  return (
                    <Chip
                      {...getTagProps({ index })}
                      key={status.value}
                      label={status.label}
                      icon={<Iconify icon={`circle-flags:${status.value?.toLowerCase()}`} />}
                      size="small"
                      variant="soft"
                    />
                  );
                })
              }
              {...other}
            />
          );
        }

        return (
          <Autocomplete
            {...field}
            id={`autocomplete-${name}`}
            onChange={(event, newValue) => setValue(name, newValue, { shouldValidate: true })}
            renderInput={(params) => (
              <TextField
                {...params}
                label={label}
                placeholder={placeholder}
                error={!!error}
                helperText={error ? error?.message : helperText}
                inputProps={{
                  ...params.inputProps,
                  autoComplete: 'new-password',
                }}
              />
            )}
            {...other}
          />
        );
      }}
    />
  );
}

RHFAutocomplete.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string,
  label: PropTypes.string,
  helperText: PropTypes.node,
  placeholder: PropTypes.string,
};

// ----------------------------------------------------------------------

export function getCountry(inputValue) {
  const option = countries.filter((country) => country.label === inputValue)[0];

  return {
    ...option,
  };
}

export function getStatus(inputValue) {
  const option = ADMIN_STATUS_OPTIONS.filter((status) => status.value === inputValue)[0];

  return {
    ...option,
  };
}
