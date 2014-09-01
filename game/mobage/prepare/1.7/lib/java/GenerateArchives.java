import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import java.util.zip.CRC32;

/**
 * zip command for GenerateArchives=true
 */
public class GenerateArchives {

	static final int EOF = -1;

	static String baseDir;

	static boolean DEBUG = true;

	/**
	 * 
	 * @param args baseDir zipPath noCompressSuffixes files...
	 */
	public static void main(String[] args) {
		try {
			if (args.length == 0) {
				args = new String[5];
				args[0] = "C:/develop/0-apps/SDK/Samples/Sprites/build";
				args[1] = "test.zip";
				args[2] = "";
				args[3] = "Content/explosion.png";
				args[4] = "Content/ground.png";
			}

			if(DEBUG) System.out.println("GenerateArchives in=" + Arrays.toString(args));

			ArrayList<String> list = new ArrayList<String>(Arrays.asList(args));

			// the working directory
			baseDir = list.get(0);
			list.remove(0);

			// the name of the archive file (*.zip)
			String zipPath = new File(baseDir, list.get(0)).getAbsolutePath();
			list.remove(0);

			// suffix list to omit compression (like zip --suffixes/-n)
			String[] noCompressSuffixes = list.get(0).split("[:;]");
			list.remove(0);

			File dir = new File(baseDir).getAbsoluteFile();
			if (!dir.exists()) {
				throw new IllegalArgumentException(dir.getAbsolutePath() +  " is not exist.");
			}
			baseDir = dir.getAbsolutePath();

			// change directory.
			System.setProperty("user.dir", baseDir);
			long start = System.currentTimeMillis();

			System.out.println("create zip : " + zipPath);

			makeZip(zipPath, list, noCompressSuffixes);

			System.out.println("create zip : " + zipPath + " end (elapsed time: " + (System.currentTimeMillis() - start) + " ms.)");
		} catch (Exception e) {
			System.out.println(e.toString());
			e.printStackTrace();
		}
	}

	public static void makeZip(String zipFilePath, ArrayList<String> targetFiles, String[] noCompressSuffixes)
			throws IOException {

		File zipFile = new File(zipFilePath);
		ZipOutputStream zos = new ZipOutputStream(new FileOutputStream(zipFile));
		try {
			for (String path : targetFiles) {
				File f = new File(path);
				addTargetFile(zos, f, noCompressSuffixes);
			}
		} finally {
			zos.close();
		}
	}

	private static void addTargetFile(ZipOutputStream zos, File file, String[] noCompressSuffixes)
			throws IOException {

		try {
			String path = file.getPath().replaceAll("\\\\", "/");
			file = file.getAbsoluteFile();

			int size = (int)file.length();
			byte[] buffer = new byte[size];
			FileInputStream fis = new FileInputStream(file);
			fis.read(buffer);
			fis.close();

			ZipEntry target = new ZipEntry(path);

			boolean not_to_compress = false;
			for(String suffix : noCompressSuffixes) {
				if( path.endsWith(suffix) ) {
					not_to_compress = true;
					break;
				}
			}

			System.out.println("add to zip : " + path + " (size: " + size + (not_to_compress ? "; uncompress" : "") + ")");
  
			if(not_to_compress) {
				target.setMethod(ZipEntry.STORED);
				target.setSize(size);
				CRC32 crc = new CRC32();
				crc.update(buffer);
				target.setCrc(crc.getValue());
			}
			zos.putNextEntry(target);
			zos.write(buffer);
			zos.closeEntry();

		} catch (Exception e) {
			System.out.println("add to zip : error " + e.toString());
		}

	}

}
