
all: GenerateArchives.class ManifestCopy.class

GenerateArchives.class: GenerateArchives.java
	LC_ALL=C javac $<

ManifestCopy.class: ManifestCopy.java
	LC_ALL=C javac -classpath json_simple-1.1.jar $<
