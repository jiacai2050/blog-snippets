;;; elcast.el --- Play podcast within elfeed.  -*- lexical-binding: t; -*-

(require 'elfeed-show)

(defgroup elcast nil
  "Tool for playing podcasts from `elfeed' enclosures."
  :group 'tools)

(defcustom elcast-player-executable (or (executable-find "vlc")
                                        (executable-find "mpv"))
  "Music player used for playing podcast."
  :type 'string
  :group 'elcast)

(defcustom elcast-player-params '()
  "Music player params"
  :type '(repeat string)
  :group 'elcast)

(defcustom elcast-buffer-name "*elcast-%s*"
  "Name of buffer for mpv process."
  :type 'string)

(defun elcast--get-url (show-entry)
  "Get the enclosure url associated with SHOW-ENTRY."
  (let ((enclosure (elfeed-entry-enclosures show-entry)))
    (car (elt enclosure 0))))

(defun elcast--launch-for-feed (feed)
  (let* ((exe elcast-player-executable)
         (url (elcast--get-url feed))
         (title (elfeed-entry-title feed))
         (buf-name (format elcast-buffer-name title)))
    (if-let (buf (get-buffer buf-name))
        (when (yes-or-no-p "Already playing this, stop and play again?")
          (apply 'start-process buf-name buf exe
                 `(,@elcast-player-params ,url)))
      (apply 'start-process buf-name buf-name exe
             `(,@elcast-player-params ,url)))))

;;;###autoload
(defun elcast-play ()
  "Play the `elfeed' podcast entry enclosure."
  (interactive)
  (if-let ((entry elfeed-show-entry))
      (elcast--launch-for-feed entry)
    (user-error "No show entry")))

(provide 'elcast)
