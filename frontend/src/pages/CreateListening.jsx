import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import { categories, types , facilities} from '../data'
import '../styles/CreateListening.scss'
import { RemoveCircleOutline, AddCircleOutline } from "@mui/icons-material";
import variables from "../styles/variables.scss";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { IoIosImages } from "react-icons/io";
import { BiTrash } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const CreateListening = () => {
    const [category, setCategory] = useState("")
    const [type, setType] = useState("");
      /* LOCATION */
    const [formLocation, setFormLocation] = useState({
        streetAddress: "",
        aptSuite: "",
        city: "",
        province: "",
        country: "",
    });
    const handleChangeLocation = (e) => {
        const { name, value } = e.target;
        setFormLocation({
          ...formLocation,
          [name]: value,
        });
    };
      /* BASIC COUNTS */
    const [guestCount, setGuestCount] = useState(1);
    const [bedroomCount, setBedroomCount] = useState(1);
    const [bedCount, setBedCount] = useState(1);
    const [bathroomCount, setBathroomCount] = useState(1);

    /* AMENITIES */
    const [amenities, setAmenities] = useState([]);

    const handleSelectAmenities = (facility) => {
        if (amenities.includes(facility)) {
            setAmenities((prevAmenities) => prevAmenities.filter((option) => option !== facility));
        } else {
            /* adding a new facility to the existing array.
            This approach ensures that you're always working with the most up-to-date state,
            amenities.push(facility) returns a number (the new length of the array).
            So setAmenities(amenities.push(facility)) would actually set the state to a number, 
            not an array. 
            another approach to add facility to the array :
            setAmenities([...amenities, facility])*/
        setAmenities((prev) => [...prev, facility]);
        }
        console.log("amenities" , amenities)
    };
    
    /* UPLOAD, DRAG & DROP, REMOVE PHOTOS */
    const [photos, setPhotos] = useState([]);

    function isFileAlreadyUploaded(newFile) {
        return photos.some(photo => 
          (photo.name === newFile.name) && (photo.size === newFile.size)
        );
    }
    
    const handleUploadPhotos = (e) => {
        const newPhotos = e.target.files;
        const items = Array.from(newPhotos);
        items.map(item => {
            if( !(isFileAlreadyUploaded(item) )){
                setPhotos((prevPhotos) => [...prevPhotos, item]);
            }
        })
        
        /* setPhotos(removeDuplicates(photos)); */
    };
    const handleDragPhoto = (result) => {
        if (!result.destination) return;

        const items = Array.from(photos);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
    
        setPhotos(items);
    };
    const handleRemovePhoto = (indexToRemove) => {
        setPhotos((prevPhotos) => prevPhotos.filter((_, index) => index !== indexToRemove));
    };

    /* DESCRIPTION */
    const [formDescription, setFormDescription] = useState({
        title: "",
        description: "",
        highlight: "",
        highlightDesc: "",
        price: 0,
    });

    const handleChangeDescription = (e) => {
        const { name, value } = e.target;
        setFormDescription({
        ...formDescription,
        [name]: value,
        });
    };
    const creatorId = useSelector((state) => state.user.user?._id);

    const navigate = useNavigate();
  
    const handlePost = async (e) => {
      e.preventDefault();
  
      try {
        /* Create a new FormData onject to handle file uploads */
        const listingForm = new FormData();
        listingForm.append("userId", creatorId);
        listingForm.append("category", category);
        listingForm.append("type", type);
        listingForm.append("streetAddress", formLocation.streetAddress);
        listingForm.append("aptSuite", formLocation.aptSuite);
        listingForm.append("city", formLocation.city);
        listingForm.append("province", formLocation.province);
        listingForm.append("country", formLocation.country);
        listingForm.append("guestCount", guestCount);
        listingForm.append("bedroomCount", bedroomCount);
        listingForm.append("bedCount", bedCount);
        listingForm.append("bathroomCount", bathroomCount);
        // this format send all the amenities in just one array item like this: 
        // listingForm(amenities, {item1, item2, item3 ....})
        listingForm.append("amenities", amenities);
        listingForm.append("title", formDescription.title);
        listingForm.append("description", formDescription.description);
        listingForm.append("highlight", formDescription.highlight);
        listingForm.append("highlightDesc", formDescription.highlightDesc);
        listingForm.append("price", formDescription.price);
  
        /* Append each selected photos to the FormData object 
        listingForm(listeningPhotos, [item1, item2, item3 ....])
        instead of sending an object with all items inside*/
        photos.forEach((photo) => {
          listingForm.append("listeningPhotos", photo);
        });
  
        /* Send a POST request to server */
        const response = await fetch(`${process.env.REACT_APP_API_URL}/listening/create-listening`, {
          method: "POST",
          body: listingForm,
        });
  
        if (response.ok) {
          navigate("/");
        }
      } catch (err) {
        console.log("Publish Listing failed", err.message);
      }
    };
    const uploadFile = 
            <>
                <input id="image" type="file" style={{ display: "none" }} multiple
                       accept="image/*" onChange={handleUploadPhotos} />
                <label htmlFor="image" className={`${photos.length > 0 ? 'together' : 'alone'}`}>
                    <div className="icon"><IoIosImages /></div>
                    <p>Upload from your device</p>
                </label>
            </>
  return (
    <div>
        <Navbar/>
        <div className="create-listing">
            <h1>Publish Your Place</h1>
            <form onSubmit={handlePost}>
                <div className="create-listing_step1">
                    <h2>Step 1: Tell us about your place</h2>
                    <hr />
                    
                    <h3>Which of these categories best describes your place?</h3>
                    <div className="category-list">
                    {categories?.map((item, index) => (
                        <div className={`category ${category === item.label ? "selected" : ""}`}                    
                            key={index} onClick={() => setCategory(item.label)}>                
                            <div className="category_icon">{item.icon}</div>
                            <p>{item.label}</p>
                        </div>
                    ))}
                    </div>
                    
                    <h3>What type of place will guests have?</h3>
                    <div className="type-list">
                    {types?.map((item, index) => (
                        <div className={`type ${type === item.name ? "selected" : ""}`}
                             key={index} onClick={() => setType(item.name)}>
                            <div className="type_text">
                                <h4>{item.name}</h4>
                                <p>{item.description}</p>
                            </div>
                            <div className="type_icon">{item.icon}</div>
                        </div>
                    ))}
                    </div>
                    
                    <h3>Where is your place located?</h3>
                    <div className="full">
                        <div className="location">
                            <p>Street Address</p>
                            <input type="text" placeholder="Street Address" name="streetAddress"
                            value={formLocation.streetAddress} onChange={handleChangeLocation} required/>
                        </div>
                    </div>

                    <div className="half">
                        <div className="location">
                            <p>Apartment, Suite, etc. (if applicable)</p>
                            <input type="text" placeholder="Apt, Suite, etc. (if applicable)" required
                            name="aptSuite" value={formLocation.aptSuite} onChange={handleChangeLocation}/>
                        </div>
                        <div className="location">
                            <p>City</p>
                            <input type="text" placeholder="City" name="city" required
                             value={formLocation.city} onChange={handleChangeLocation}/>
                        </div>
                    </div>

                    <div className="half">
                        <div className="location">
                            <p>Province</p>
                            <input type="text" placeholder="Province" name="province" required
                            value={formLocation.province} onChange={handleChangeLocation}/>
                        </div>
                        <div className="location">
                            <p>Country</p>
                            <input type="text" placeholder="Country" name="country"
                            value={formLocation.country} onChange={handleChangeLocation} required/>
                        </div>
                    </div>

                    <h3>Share some basics about your place</h3>
                    <div className="basics">
                        <div className="basic">
                            <p>Guests</p>
                            <div className="basic_count">
                            <RemoveCircleOutline onClick={() => { guestCount > 1 && setGuestCount(guestCount - 1);}}
                                sx={{ fontSize: "25px", cursor: "pointer", "&:hover": { color: variables.pinkred }}}
                            />
                            <p>{guestCount}</p>
                            <AddCircleOutline onClick={() => { setGuestCount(guestCount + 1);}}
                                sx={{ fontSize: "25px", cursor: "pointer", "&:hover": { color: variables.pinkred }}}
                            />
                            </div>
                        </div>

                        <div className="basic">
                            <p>Bedrooms</p>
                            <div className="basic_count">
                            <RemoveCircleOutline onClick={() => { bedroomCount > 1 && setBedroomCount(bedroomCount - 1);}}
                                sx={{ fontSize: "25px", cursor: "pointer", "&:hover": { color: variables.pinkred }}}
                            />
                            <p>{bedroomCount}</p>
                            <AddCircleOutline onClick={() => { setBedroomCount(bedroomCount + 1);}}
                                sx={{ fontSize: "25px", cursor: "pointer", "&:hover": { color: variables.pinkred }}}
                            />
                            </div>
                        </div>

                        <div className="basic">
                            <p>Beds</p>
                            <div className="basic_count">
                            <RemoveCircleOutline onClick={() => { bedCount > 1 && setBedCount(bedCount - 1);}}
                                sx={{ fontSize: "25px", cursor: "pointer", "&:hover": { color: variables.pinkred }}}
                            />
                            <p>{bedCount}</p>
                            <AddCircleOutline onClick={() => { setBedCount(bedCount + 1);}}
                                sx={{ fontSize: "25px", cursor: "pointer", "&:hover": { color: variables.pinkred }}}
                            />
                            </div>
                        </div>

                        <div className="basic">
                            <p>Bathrooms</p>
                            <div className="basic_count">
                            <RemoveCircleOutline onClick={() => { bathroomCount > 1 && setBathroomCount(bathroomCount - 1);}}
                                sx={{ fontSize: "25px", cursor: "pointer", "&:hover": { color: variables.pinkred }}}
                            />
                            <p>{bathroomCount}</p>
                            <AddCircleOutline onClick={() => { setBathroomCount(bathroomCount + 1);}}
                                sx={{ fontSize: "25px", cursor: "pointer", "&:hover": { color: variables.pinkred }}}
                            />
                            </div>
                        </div>
                    </div>
                </div>

                <div className='create-listing_step2'>
                    <h2>Step 2: Make your place stand out</h2>
                    <hr />
                    <h3>Tell guests what your place has to offer</h3>
                    <div className="amenities">
                        {facilities?.map((item, index) => (
                            <div className={`facility ${amenities.includes(item.name) ? "selected" : ""}`}
                                 key={index} onClick={() => handleSelectAmenities(item.name)}>
                                <div className="facility_icon">{item.icon}</div>
                                <p>{item.name}</p>
                            </div>
                        ))}
                    </div>

                    <h3>Add some photos of your place</h3>
                    <DragDropContext onDragEnd={handleDragPhoto}>
                        <Droppable droppableId={`${photos.length}`} direction="horizontal">
                            {(provided) => (
                            <div className="photos" {...provided.droppableProps}  ref={provided.innerRef}>
                                {photos.length < 1 ? (
                                <>{uploadFile}</>
                                ) : (
                                <>
                                    {photos.map((photo, index) =>  (
                                        <Draggable key={index} draggableId={`photo - ${index}`} index={index}>
                                        {(provided) => (
                                            <div className="photo"  ref={provided.innerRef}  
                                                {...provided.draggableProps}  {...provided.dragHandleProps}>
                                                <img src={URL.createObjectURL(photo)} alt="place" />
                                                <button type="button" onClick={() => handleRemovePhoto(index)}>
                                                    <BiTrash />
                                                </button>
                                            </div>
                                        )}
                                        </Draggable>
                                    )
                                    )}
                                    {uploadFile}
                                </>
                                )}
                            </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                    <h3>What make your place attractive and exciting?</h3>
                    <div className="description">
                        <p>Title</p>
                        <input type="text" placeholder="Title" name="title" required
                            value={formDescription.title} onChange={handleChangeDescription}/>

                        <p>Description</p>
                        <textarea type="text" placeholder="Description" name="description" required
                            value={formDescription.description} onChange={handleChangeDescription}/>
                        <p>Highlight</p>
                        <input type="text" placeholder="Highlight" name="highlight" required
                            value={formDescription.highlight} onChange={handleChangeDescription}/>

                        <p>Highlight details</p>
                        <textarea type="text" placeholder="Highlight details" name="highlightDesc" required
                            value={formDescription.highlightDesc} onChange={handleChangeDescription}/>

                        <p>Now, set your PRICE</p>
                        <span>$</span>
                        <input type="number" className="price" placeholder="100" name="price" required
                            value={formDescription.price} onChange={handleChangeDescription}/>
                    </div>
                </div>
                <button type='submit' className="submit_btn">CREATE YOUR LISTENING</button>
            </form>
        </div>
    </div>
  )
}

export default CreateListening