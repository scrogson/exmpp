top_srcdir=..
srcdir=.

KNOWN_NSS_SOURCE = $(top_srcdir)/include/internal/exmpp_known_nss.in
KNOWN_ELEMS_SOURCE = $(top_srcdir)/include/internal/exmpp_known_elems.in
KNOWN_ATTRS_SOURCE = $(top_srcdir)/include/internal/exmpp_known_attrs.in

BUILT_SOURCES = exmpp_known_nss.erl					\
		exmpp_known_elems.erl					\
		exmpp_known_attrs.erl

CLEANFILES = $(BUILT_SOURCES)

all: $(BUILT_SOURCES)

clean:
	rm -r $(CLEANFILES)

# --------------------------------------------------------------------
# Known namespaces/names/attributes headers generation.
# --------------------------------------------------------------------

exmpp_known_nss.erl: $(srcdir)/exmpp_known_nss.erl.es $(KNOWN_NSS_SOURCE)
	$(srcdir)/exmpp_known_nss.erl.es $(KNOWN_NSS_SOURCE) > $@

exmpp_known_elems.erl: $(srcdir)/exmpp_known_elems.erl.es $(KNOWN_ELEMS_SOURCE)
	$(srcdir)/exmpp_known_elems.erl.es $(KNOWN_ELEMS_SOURCE) > $@

exmpp_known_attrs.erl: $(srcdir)/exmpp_known_attrs.erl.es $(KNOWN_ATTRS_SOURCE)
	$(srcdir)/exmpp_known_attrs.erl.es $(KNOWN_ATTRS_SOURCE) > $@
