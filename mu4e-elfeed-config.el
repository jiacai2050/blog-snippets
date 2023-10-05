;; Mu4e
(use-package mu4e
  :ensure nil
  :if (executable-find "mu")
  ;; brew ls mu
  :load-path "/path/to/mu4e"
  :commands (mu4e)
  :bind (:map mu4e-view-mode-map
         ("f" . mu4e~headers-jump-to-maildir)
         ("9" . scroll-down-command)
         ("0" . scroll-up-command)
         ("&" . my/open-url-in-external)
         ("<M-return>" . my/open-url-in-new-buffer)
         ("<s-return>" . my/open-url-in-background)
         ("h" . mu4e~headers-jump-to-maildir)
         :map mu4e-main-mode-map
         ("g" . mu4e-update-mail-and-index)
         :map mu4e-headers-mode-map
         ("<backspace>" . scroll-down-command)
         ("j" . mu4e-headers-next)
         ("k" . mu4e-headers-prev)
         ("h" . mu4e~headers-jump-to-maildir)
         ("r" . mu4e-headers-mark-for-read)
         ("!" . mu4e-headers-flag-all-read)
         ("f" . mu4e-headers-mark-for-flag)
         :map mu4e-compose-mode-map
         ("C-c '" . org-mime-edit-mail-in-org-mode))
  :custom ((mu4e-headers-fields '((:human-date    .   12)
                                  (:flags         .    6)
                                  (:from-or-to    .   22)
                                  (:thread-subject .  nil)))
           (mu4e-hide-index-messages t))
  :init
  (setq user-mail-address "hello@liujiacai.net"
        user-full-name "Jiacai Liu"
        mail-user-agent 'mu4e-user-agent
        mu4e-debug nil
        message-send-mail-function 'smtpmail-send-it
        ;; https://emacs.stackexchange.com/a/45216/16450
        message-citation-line-format "\nOn %a, %b %d, %Y at %r %z, %N wrote:\n"
        message-citation-line-function 'message-insert-formatted-citation-line
        ;; message-cite-style message-cite-style-gmail
        mml-secure-openpgp-signers '("D3026E5C08A0BAB4")
        ;; https://github.com/djcb/mu/issues/1798
        mm-discouraged-alternatives '("text/html" "text/richtext"))
  :config
  (setenv "XAPIAN_CJK_NGRAM" "true")
  (require 'mu4e-contrib)
  (setq mu4e-contexts
		(list
         (make-mu4e-context
		  :name "ljc"
          :match-func (lambda (msg)
                        (when msg
                          (string-prefix-p "/ljc" (mu4e-message-field msg :maildir))))
          :vars '((mu4e-sent-folder . "/ljc/Sent")
                  (mu4e-trash-folder . "/ljc/Trash")
                  (mu4e-refile-folder . "/ljc/Archive")
                  (mu4e-drafts-folder . "/ljc/Drafts")
                  (user-mail-address . "hello@liujiacai.net")
                  (smtpmail-smtp-service . 465)
                  (smtpmail-smtp-user . "hello@liujiacai.net")
                  (smtpmail-smtp-server . "smtp.yandex.com")
                  (smtpmail-stream-type . ssl)))
         (make-mu4e-context
		  :name "yandex"
          :match-func (lambda (msg)
                        (when msg
                          (string-prefix-p "/yandex" (mu4e-message-field msg :maildir))))
          :vars '((mu4e-sent-folder . "/yandex/Sent")
                  (mu4e-trash-folder . "/yandex/Trash")
                  (mu4e-refile-folder . "/yandex/Archive")
                  (mu4e-drafts-folder . "/yandex/Drafts")
                  (user-mail-address . "liujiacai@yandex.com")
                  (smtpmail-smtp-user . "liujiacai@yandex.com")
                  (smtpmail-smtp-service . 465)
                  (smtpmail-smtp-server . "smtp.yandex.com")
                  (smtpmail-stream-type . ssl))))
        mu4e-compose-complete-only-personal t
        mu4e-view-show-addresses t
        mu4e-view-show-images nil
        mu4e-attachment-dir "~/Downloads"
        mu4e-sent-messages-behavior 'sent
        mu4e-context-policy 'pick-first
        mu4e-compose-context-policy 'ask-if-none
        mu4e-compose-dont-reply-to-self t
        mu4e-confirm-quit nil
        mu4e-headers-date-format "%+4Y-%m-%d"
        mu4e-view-date-format "%a, %Y-%m-%d %T"
        mu4e-view-html-plaintext-ratio-heuristic  most-positive-fixnum
        mu4e-update-interval (* 30 60)
        ;; get mail in external process
        ;; mu4e-get-mail-command "true"
        mu4e-get-mail-command "gtimeout 120 offlineimap -o -q -u basic -l /tmp/mail.log >> /tmp/imap.log"
        mu4e-compose-format-flowed t
        mu4e-completing-read-function 'ivy-read
        mu4e-bookmarks '((:name "All Inbox"
                          ;; :query "maildir:/ljc/INBOX or maildir:/outlook/Inbox"
                          :query "maildir:/ljc/INBOX"
                          :key ?i)
                         (:name  "Unread messages"
                          :query "flag:unread AND NOT flag:trashed"
                          :key ?u)
                         (:name "Today's messages"
                          :query "date:today..now"
                          :key ?t)
                         (:name "Last 7 days"
                          :query "date:7d..now"
                          :hide-unread t
                          :key ?w)
                         (:name "Flagged"
                          :query "flag:flagged"
                          :key ?f)
                         (:name "Sent"
                          ;; https://github.com/djcb/mu/issues/241
                          ;; :query "maildir:\"/ljc/Sent Messages\""
                          :query "maildir:/ljc/Sent"
                          :key ?s)
                         (:name "Emacs"
                          :query "maildir:/ljc/Emacs"
                          :key ?e)
                         (:name "Postgres"
                          :query "maildir:/ljc/pg-hackers"
                          :key ?p)
                         (:name "GitHub"
                          :query "maildir:/ljc/GitHub"
                          :key ?g)))
  (evil-add-hjkl-bindings mu4e-view-mode-map)
  (add-to-list 'mu4e-view-actions '("browser" . mu4e-action-view-in-browser) t)

  (defun my/mu4e-pre-update-hook ()
    (let ((inhibit-message t))
      (message "Update and index mu4e at %s" (format-time-string "%D %-I:%M %p"))))

  (defun my/mu4e-stop-update-task ()
    (interactive)
    (when mu4e--update-timer
      (cancel-timer mu4e--update-timer)
      (setq mu4e--update-timer nil)))

  (setq mu4e-update-pre-hook 'my/mu4e-pre-update-hook)

  (require 'cl)
  (require 'org-contacts)
  (setq mu4e-org-contacts-file my/contacts-file)
  (add-to-list 'mu4e-headers-actions
               '("org-contact-add" . mu4e-action-add-org-contact) t)
  (add-to-list 'mu4e-view-actions
               '("org-contact-add" . mu4e-action-add-org-contact) t)
  (add-to-list 'mu4e-view-fields :bcc))

(use-package message
  :ensure nil
  :defer t
  :hook (message-send . my/sign-or-encrypt-message)
  :init
  (defun my/sign-or-encrypt-message ()
    (let ((answer (read-from-minibuffer "Sign or encrypt?[s/e]: ")))
      (cond
       ((string-equal answer "s") (progn
                                    (message "Signing message.")
                                    (mml-secure-message-sign-pgpmime)))
       ((string-equal answer "e") (progn
                                    (message "Encrypt and signing message.")
                                    (mml-secure-message-encrypt-pgpmime)))
       (t (progn
            (message "Dont signing or encrypting message.")
            nil))))))

;; Elfeed
(use-package elfeed
  :ensure nil
  :custom ((elfeed-use-curl t)
           (elfeed-db-directory "~/Downloads/elfeed/")
           (elfeed-curl-timeout 20)
           (elfeed-curl-extra-arguments `("-x" ,socks-proxy)))
  :bind (:map elfeed-show-mode-map
         ("8" . my/elfeed-toggle-star)
         ("9" . my/elfeed-show-images)
         ("g" . elfeed-show-refresh)
         ("w" . my/copy-url)
         ("v" . my/fanyi-url)
         ("d" . my/download-url)
         ("&" . my/open-url-in-external)
         ("<M-return>" . my/open-url-in-new-buffer)
         ("<s-return>" . my/open-url-in-background)
         :map elfeed-search-mode-map
         ("SPC" . scroll-up-command)
         ("DEL" . scroll-down-command)
         ("f" . my/elfeed-search-by-title)
         ("b" . my/elfeed-browse)
         ("8" . my/elfeed-toggle-star)
         ("*" . my/elfeed-toggle-unstar))
  :init
  (progn
    (my/generate-autoloads "elfeed" (my/expand-vendor-dir "elfeed"))

    (defun my/elfeed-browse ()
      (interactive)
      (let ((entries (elfeed-search-selected)))
        (elfeed-untag entries 'unread)
        (mapc #'elfeed-search-update-entry entries))
      (elfeed-search-browse-url))

    (defun my/elfeed-add-title-tag (entry)
      (when-let* ((feed (elfeed-entry-feed entry))
                  (title (cl-destructuring-bind (&key title &allow-other-keys)
                             (elfeed-feed-meta feed)
                           title)))
        (elfeed-tag entry (intern title))))

    (add-hook 'elfeed-new-entry-hook 'my/elfeed-add-title-tag 1)

    (defun my/elfeed-hook ()
      (my/set-font "")
      ;; (setq-local shr-inhibit-images nil)
      (setq-local line-spacing 0.2)
      (setq-local shr-width 85))

    (defun my/elfeed-search-print-entry (entry)
      (let* ((date (elfeed-search-format-date (elfeed-entry-date entry)))
             (title (or (elfeed-meta entry :title) (elfeed-entry-title entry) ""))
             (title-faces (elfeed-search--faces (elfeed-entry-tags entry)))
             (feed (elfeed-entry-feed entry))
             (feed-title (when feed
                           (or (elfeed-meta feed :title) (elfeed-feed-title feed))))
             (tags (seq-filter
                    (lambda (tag) (not (string-equal feed-title tag)))
                    (mapcar #'symbol-name (elfeed-entry-tags entry))))
             (tags-str (mapconcat
                        (lambda (s) (propertize s 'face 'elfeed-search-tag-face))
                        tags ","))
             (title-width (- (window-width) 10 elfeed-search-trailing-width))
             (title-column (elfeed-format-column
                            title (elfeed-clamp
                                   elfeed-search-title-min-width
                                   title-width
                                   elfeed-search-title-max-width)
                            :left)))
        (insert (propertize date 'face 'elfeed-search-date-face) " ")
        (insert (propertize title-column 'face title-faces 'kbd-help title) " ")
        (when feed-title
          (insert (propertize feed-title 'face 'elfeed-search-feed-face) " "))
        (when tags
          (insert "(" tags-str ")"))))

    (setq elfeed-search-print-entry-function 'my/elfeed-search-print-entry))

  :hook ((elfeed-search-mode elfeed-show-mode) . my/elfeed-hook)
  :config
  (progn
    (setq elfeed-search-filter "@1-months-ago +unread #50"
          elfeed-feeds '())

    (evil-add-hjkl-bindings elfeed-show-mode-map)
    (evil-add-hjkl-bindings elfeed-search-mode-map)

    (defun my/elfeed-clear-queue ()
      "Sometime elfeed update will end with pending task, which popup at minibuffer, this fix the annoying message"
      (interactive)
      (setq elfeed-curl-queue-active 0))

    (defun my/elfeed-show-images ()
      (interactive)
      (let ((shr-inhibit-images nil))
        (elfeed-show-refresh)))
    ;;functions to support syncing .elfeed between machines
    ;;makes sure elfeed reads index from disk before launching
    (defun my/elfeed-open-db-and-load ()
      "Wrapper to load the elfeed db from disk before opening"
      (interactive)
      (elfeed-db-load)
      (elfeed)
      (elfeed-search-update--force))

    ;;write to disk when quiting
    (defun my/elfeed-close-db-and-save ()
      "Wrapper to save the elfeed db to disk before burying buffer"
      (interactive)
      (elfeed-db-save)
      ;; (quit-window)
      )

    (defun my/elfeed-toggle-star ()
      (interactive)
      (when elfeed-show-entry
        (let* ((tag (intern "starred"))
               (taggged (elfeed-tagged-p tag elfeed-show-entry)))
          (if taggged
              (elfeed-untag elfeed-show-entry tag)
            (elfeed-tag elfeed-show-entry tag))
          (message "Starred: %s" (not taggged)))))

    (defun my/elfeed-search-star ()
      (interactive)
	  (let ((tag (intern "starred"))
            (entries (elfeed-search-selected)))
	    (cl-loop for entry in entries do (elfeed-tag entry tag))
	    (mapc #'elfeed-search-update-entry entries)
	    (unless (use-region-p) (forward-line))))

    (defun my/elfeed-search-unstar ()
      "Remove starred tag from all selected entries."
      (interactive)
	  (let ((tag (intern "starred"))
            (entries (elfeed-search-selected)))
	    (cl-loop for entry in entries do (elfeed-untag entry tag))
	    (mapc #'elfeed-search-update-entry entries)
	    (unless (use-region-p) (forward-line))))

    (setq my/elfeed-export-dir (expand-file-name "~/Documents/"))
    (defun my/elfeed-export (dir)
      (interactive (list (read-directory-name "Export dir: " my/elfeed-export-dir)))
      (require 'f)
      (let* ((sf (elfeed-search-parse-filter "+starred"))
	         (uf (elfeed-search-parse-filter "-unread"))
	         (starred-entries '())
	         (read-entries '())
	         (hash-table (make-hash-table))
             (output (expand-file-name (format-time-string "elfeed-%Y-%m-%d.el" (current-time))
                                       dir)))
        (with-elfeed-db-visit (entry feed)
          (let ((title-and-link  (cons (elfeed-entry-title entry)
                                       (elfeed-entry-link entry))))
	        (when (elfeed-search-filter sf entry feed)
	          (add-to-list 'starred-entries title-and-link))
	        (when (elfeed-search-filter uf entry feed)
	          (add-to-list 'read-entries title-and-link))))

        (puthash :starred starred-entries hash-table)
        (puthash :read read-entries hash-table)
        (f-write-text (prin1-to-string hash-table) 'utf-8 output)

        (message "Export to %s. starred: %d, read: %d" output (length starred-entries) (length read-entries))))

    (defun my/elfeed-import (f)
      (interactive (list (read-file-name "Backup file: " my/elfeed-export-dir)))
      (require 'f)
      (let* ((hash-table (read (f-read-text f)))
             (starred-entries (gethash :starred hash-table))
             (read-entries (gethash :read hash-table)))
        (with-elfeed-db-visit (entry feed)
          (let* ((link (elfeed-entry-link entry)))
            (when (member link starred-entries)
              (elfeed-tag entry (intern "starred")))
            (when (member link read-entries)
              (elfeed-untag entry (intern "unread")))))

        (message "Import starred: %d, read: %d" (length starred-entries) (length read-entries))))

    (defun my/elfeed-search-by-title (title)
      (interactive (list (or (when-let* ((entry (car (elfeed-search-selected)))
                                         (feed (elfeed-entry-feed entry)))
                               (or (cl-destructuring-bind (&key title &allow-other-keys)
                                       (elfeed-feed-meta feed)
                                     title)
                                   (elfeed-feed-title feed)))
                             (read-from-minibuffer "Feed Title: "))))
      (unwind-protect
          (let ((elfeed-search-filter-active :live))
            (setq elfeed-search-filter (concat "+" title)))
        (elfeed-search-update :force)))

    (custom-set-faces
     '(elfeed-search-unread-title-face ((((class color) (background light)) (:foreground "#000" :weight normal :strike-through nil))
                                        (((class color) (background dark)) (:foreground "#fff" :weight normal :strike-through nil))))

     '(elfeed-search-title-face ((((class color) (background light)) (:foreground "grey" :strike-through t))
							     (((class color) (background dark)) (:foreground "grey" :strike-through t)))))

    ;; face for starred articles
    (defface elfeed-search-starred-title-face
      '((t :foreground "#f77" :strike-through nil))
      "Marks a starred Elfeed entry.")

    (push '(starred elfeed-search-starred-title-face) elfeed-search-face-alist)))

(use-package elfeed-dashboard
  :ensure nil
  :commands (elfeed-dashboard)
  :bind (:map elfeed-dashboard-mode-map
         ("/" . my/feed-choose-by-tag)
         :map elfeed-search-mode-map
         ("/" . my/feed-choose-by-tag))
  :config
  (setq elfeed-dashboard-file (no-littering-expand-etc-file-name "elfeed-dashboard.org"))
  ;; update feed counts on elfeed-quit
  (advice-add 'elfeed-search-quit-window :after #'elfeed-dashboard-update-links)

  (defun my/feed-choose-by-tag ()
    (interactive)
    (ivy-read "Tag: " (elfeed-db-get-all-tags)
              :action (lambda (tag)
                        (elfeed-dashboard-query (format "+unread +%s" tag))))))

(use-package elfeed-org
  :ensure nil
  :custom ((rmh-elfeed-org-files `(,(no-littering-expand-etc-file-name "elfeed-feeds.org"))))
  :hook (elfeed-dashboard-mode . elfeed-org)
  :init
  (progn
    (defun my/reload-org-feeds ()
      (interactive)
      (rmh-elfeed-org-process rmh-elfeed-org-files rmh-elfeed-org-tree-id))
    (advice-add 'elfeed-dashboard-update :before #'my/reload-org-feeds)))
