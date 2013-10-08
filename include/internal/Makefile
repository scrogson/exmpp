srcdir=.

MAKE_SPECS_LIST = $(srcdir)/make-specs-list
EXTRACT_KNOWN = $(srcdir)/extract-known-from-specs

KNOWN_NSS_SOURCE = exmpp_known_nss.in
KNOWN_ELEMS_SOURCE = exmpp_known_elems.in
KNOWN_ATTRS_SOURCE = exmpp_known_attrs.in

KNOWN_NSS_HRL = exmpp_known_nss.hrl
KNOWN_ELEMS_HRL = exmpp_known_elems.hrl
KNOWN_ATTRS_HRL = exmpp_known_attrs.hrl

BUILT_SOURCES = $(KNOWN_NSS_SOURCE) $(KNOWN_ELEMS_SOURCE) $(KNOWN_ATTRS_SOURCE)
BUILT_HEADERS = $(KNOWN_NSS_HRL) $(KNOWN_ELEMS_HRL) $(KNOWN_ATTRS_HRL)

CLEANFILES = $(BUILT_SOURCES) $(BUILT_HEADERS)

all: $(BUILT_HEADERS)

clean:
	rm -r $(CLEANFILES)

# --------------------------------------------------------------------
# Known namespaces/names/attributes headers generation.
# --------------------------------------------------------------------

exmpp_known_nss.hrl: $(srcdir)/exmpp_known_nss.hrl.es $(KNOWN_NSS_SOURCE)
	$(srcdir)/exmpp_known_nss.hrl.es $(KNOWN_NSS_SOURCE) > $@

exmpp_known_elems.hrl: $(srcdir)/exmpp_known_elems.hrl.es $(KNOWN_ELEMS_SOURCE)
	$(srcdir)/exmpp_known_elems.hrl.es $(KNOWN_ELEMS_SOURCE) > $@

exmpp_known_attrs.hrl: $(srcdir)/exmpp_known_attrs.hrl.es $(KNOWN_ATTRS_SOURCE)
	$(srcdir)/exmpp_known_attrs.hrl.es $(KNOWN_ATTRS_SOURCE) > $@

# --------------------------------------------------------------------
# Known namespaces/names/attributes updates.
# --------------------------------------------------------------------

updateknown: $(MAKE_SPECS_LIST) $(EXTRACT_KNOWN)
	@( $(MAKE_SPECS_LIST); cat occi-schemas.in )   			\
		| $(EXTRACT_KNOWN)					\
		$(KNOWN_NSS_SOURCE)					\
		$(KNOWN_ELEMS_SOURCE)					\
		$(KNOWN_ATTRS_SOURCE)

.PHONY: all clean updateknown
