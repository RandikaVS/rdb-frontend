import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';

import { OverviewAppView } from 'src/sections/overview/app/view';
import Backdrop from '@mui/material/Backdrop';
import { ComingSoonIllustration } from 'src/assets/illustrations';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useCountdownDate } from 'src/hooks/use-countdown';

// ----------------------------------------------------------------------

export default function OverviewAppPage() {

  const { days, hours, minutes, seconds } = useCountdownDate(new Date('07/07/2024 21:30'));

  return (
    <>
      <Helmet>
        <title> Dashboard: RDB</title>
      </Helmet>
      
      <Backdrop
        sx={{ 
          top: '4vw',
          left: '20vw',
          width: '80%',
          height: '100%',
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 1 
        }}
        open={true}
      >
        <Stack
          direction="column"
          position="relative"
          justifyContent="center"
          alignItems="center"
          spacing={2}
          sx={{ typography: 'h2'}}
        >
          <ComingSoonIllustration />
          <Stack
            direction="row"
            justifyContent="center"
            divider={<Box sx={{ mx: { xs: 1, sm: 2.5 } }}>:</Box>}
            sx={{ typography: 'h2' }}
          >
            Coming Soon...
          </Stack>

          <Stack
            direction="row"
            justifyContent="center"
            divider={<Box sx={{ mx: { xs: 1, sm: 2.5 } }}>:</Box>}
            sx={{ typography: 'h2' }}
          >
            <TimeBlock label="Days" value={days} />
            <TimeBlock label="Hours" value={hours} />
            <TimeBlock label="Minutes" value={minutes} />
            <TimeBlock label="Seconds" value={seconds} />
          </Stack>
        </Stack>
      </Backdrop>
          
      <OverviewAppView />
    </>
  );
}
function TimeBlock({ label, value }) {
  return (
    <div>
      <Box> {value} </Box>
      <Box sx={{ color: 'text.secondary', typography: 'body1' }}>{label}</Box>
    </div>
  );
}

TimeBlock.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
};
