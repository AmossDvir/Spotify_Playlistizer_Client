import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  DataGrid,
  useGridApiEventHandler,
  useGridApiContext,
} from "@mui/x-data-grid";
import prepareTableData from "../prepareTableData";
import UseMobileWidth from "../../../generalComponents/UseMobileWidth";
import { playSong } from "../../../model/songPlaybackSlice";
import ColoredButton from "../../../generalComponents/ColoredButton";
import IosShareIcon from "@mui/icons-material/IosShare";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ColoredTooltip from "../../../generalComponents/ColoredTooltip";
import DialogWindow from "../../../generalComponents/DialogWindow";
import SaveToSpotifyForm from "../SaveToSpotifyForm";
import { saveToSpotify } from "../../../controllers/spotify/saveToSpotifyController";
import SuccessSnackBar from "../../../generalComponents/SuccessSnackBar";
import ErrorSnackBar from "../../../generalComponents/ErrorSnackBar";
import { errorCodesLabels } from "../../../constants";
import "./SongsList.css";
import { Typography } from "@mui/material";

// import PlayerControlButtons from "./PlayerControlButtons";

const SongsList = ({ songsList, userPlaylists }) => {
  const itemsPerPage = 100;
  const userSelector = useSelector((state) => state.user.value);
  const [playlistName, setPlaylistName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [successSnackBarOpen, setSuccessSnackBarOpen] = useState(false);
  const [errorSnackBarOpen, setErrorSnackBarOpen] = useState(false);
  const [error, setError] = useState(0);

  const onSaveToSpotify = () => {
    setDialogOpen(true);
  };

  const onCloseDialog = () => {
    setDialogOpen(false);
  };

  const onConfirmDialog = async () => {
    if (userPlaylists && userPlaylists?.mostRecent) {
      const res = await saveToSpotify(
        playlistName,
        description,
        isPublic,
        userPlaylists,
        localStorage.getItem(userSelector.userId + "spotifyAccessToken")
      );
      if (res?.status === 200) {
        onCloseDialog();
        setSuccessSnackBarOpen(true);
      } else {
        console.log(res);
        setError(res?.status || res.code);
        setErrorSnackBarOpen(true);
      }
      return res;
    }
  };

  const [tableData, setTableData] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);

  const isMobile = UseMobileWidth();
  const dispatch = useDispatch();

  const onPlaySongClick = (rowIndex) => {
    dispatch(playSong(songsList[rowIndex]));
  };

  useEffect(() => {
    setTableData(
      prepareTableData(
        songsList,
        isMobile
          ? [
              "songNumber",
              "title",
              // "album",
              "genre",
            ]
          : ["songNumber", "title", "album", "duration", "genre"],
        hoveredRow,
        onPlaySongClick
      )
    );
  }, [hoveredRow, isMobile]);

  const SuccessSnackBarMemoized = useMemo(
    () => (
      <SuccessSnackBar
        open={successSnackBarOpen}
        onClose={() => setSuccessSnackBarOpen(false)}
        promptStr="Playlist Saved Successfully"
      ></SuccessSnackBar>
    ),
    [successSnackBarOpen]
  );

  const ErrorSnackBarMemoized = useMemo(
    () => (
      <ErrorSnackBar
        open={errorSnackBarOpen}
        onClose={() => setErrorSnackBarOpen(false)}
        promptStr={errorCodesLabels[error]}
      ></ErrorSnackBar>
    ),
    [errorSnackBarOpen]
  );

  useEffect(() => {
    setSuccessSnackBarOpen(false);
    setErrorSnackBarOpen(false);
  }, []);

  return (
    <div className="songs-list-main">
      {tableData.rows && (
        <DataGrid
          componentsProps={{
            row: {
              onMouseOver: (e) =>
                setHoveredRow(Number(e.currentTarget.getAttribute("data-id"))),
              onMouseLeave: (e) => setHoveredRow(null),
            },
          }}
          sx={{
            backgroundColor: "#424554bd",
            "& .MuiDataGrid-columnHeader": { cursor: "default" },
            borderColor: "primary.light",
            "& .MuiDataGrid-cell:hover": {
              color: "primary.main",
            },
            "& .MuiDataGrid-cell:focus": {
              outline: "none",
              fontWeight: 500,
            },
            "& .MuiDataGrid-columnHeader:focus": {
              outline: "none",
            },
            "& .MuiDataGrid-sortIcon:focus": {
              outline: "none !important",
            },
            "& .MuiTablePagination-root": {
              color: "neutral.main",
            },
          }}
          rows={tableData.rows}
          columns={tableData.columns}
          columnBuffer={2}
          columnThreshold={2}
          pageSize={itemsPerPage}
          disableColumnMenu
          disableColumnSelector
          rowHeight={65}
          rowsPerPageOptions={[]}
          withBorder={false}
          hideFooterSelectedRowCount={true}
          components={{
            Header: () => (
              <div className="header-main">
                <div className="header-icons">
                  <IconButton
                    aria-label="save-to-spotify"
                    color="primary"
                    onClick={onSaveToSpotify}
                  >
                    <ColoredTooltip title="Save to Spotify">
                      <IosShareIcon />
                    </ColoredTooltip>
                  </IconButton>
                </div>
                <div className="header-title">
                  <Typography>Playlist #1</Typography>
                </div>
              </div>
            ),
          }}
          hideFooterPagination={false}
        />
      )}
      <DialogWindow
        title="Playlist Properties"
        bodyText="The Playlist Will Contain The Following Properties:"
        isOpen={dialogOpen}
        onClose={onCloseDialog}
        hasCancelButton
        onConfirm={onConfirmDialog}
        confirmDisabled={playlistName.length <= 0}
        hasLoading
      >
        <SaveToSpotifyForm
          playlistName={playlistName}
          description={description}
          isPublic={isPublic}
          setPlaylistName={setPlaylistName}
          setDescription={setDescription}
          setIsPublic={setIsPublic}
        ></SaveToSpotifyForm>
      </DialogWindow>
      {SuccessSnackBarMemoized}
      {ErrorSnackBarMemoized}
    </div>
  );
};

export default SongsList;
