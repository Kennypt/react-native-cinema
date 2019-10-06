import './index';
import theaterLocations from '../../controllers/dataCollectors/theaters/locations';
import theaterInfo from '../../controllers/dataCollectors/theaters/info';
import { getMovieById } from '../../controllers/dataCollectors/movies/info'
import inExhibition from '../../controllers/dataCollectors/movies/inExhebition'

// theaterLocations();
// theaterInfo();
// getMovieById({ id: '617776' });
inExhibition();
