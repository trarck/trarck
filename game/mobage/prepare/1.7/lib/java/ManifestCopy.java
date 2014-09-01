import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.channels.FileChannel;
import java.sql.Time;
import java.util.ArrayList;
import java.util.Arrays;

import javax.imageio.ImageIO;
import javax.swing.ImageIcon;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

public class ManifestCopy {

	/** build target */
	final static int DEVICE_iOS = 0;
	final static int DEVICE_Android = 1;
	final static int DEVICE_Flash = 2;
	final static int DEVICE_Curl = 3;
	final static int DEVICE_All = 4;

	final static boolean DEBUG = "1".equals(System.getenv("MANIFESTCOPY_DEBUG"));

    static String globCommand = null;

    private static void debug(String message) {
        if(DEBUG) {
            System.out.println("ManifestCopy.DEBUG " + message);
        }
    }

	public static void main(String[] args) {
		try {
            File classFile = new File(ManifestCopy.class.getResource("/" +
                    ManifestCopy.class.getName().replace('.', '/') + ".class").toURI());
            File thisDir   = classFile.getParentFile();
            globCommand    = (new File(thisDir, "../../glob.js")).getCanonicalPath();

			if (args.length == 0) {
				args = new String[3];
				System.setProperty("user.dir", "C:/develop/0-apps/SDK");
				args[0] = "./Samples/Sprites/manifest.json";
				args[1] = "Samples/Sprites";
				args[2] = "buildtarget=1";
			}

            long t0 = System.currentTimeMillis();
			debug("start");
			
			start(args);
			
			debug("end: " + (System.currentTimeMillis() - t0) + " ms.");
		} catch (Exception e) {
			System.out.println("ManifestCopy error: " + e.toString());
			e.printStackTrace();
		}
	}

	private static void start(String[] args) throws Exception {
		debug("ManifestCopy in=" + Arrays.toString(args));
		if (args.length < 3)
			throw new IllegalArgumentException("Argument is invalid.");

		// manifest.json path
		File manifestFile = new File(args[0]).getAbsoluteFile();
		if (!manifestFile.exists())
			throw new IllegalArgumentException("Not exist manifest file. " + args[0]);

		String manifest = readFile(manifestFile);
		if (manifest.equals("{}")) {
			System.out.println("ManifestCopy: No content in " + manifestFile);
			return;
		}
		JSONParser parser = new JSONParser();
		JSONObject json = (JSONObject) parser.parse(manifest);

        // base directory (e.g. Samples/Launcher)
		String baseDir = args[1];
        debug("baseDir: " + baseDir);

		// buildtarget=[0-4]
		String[] rets = args[2].split("=");
		if (args.length < 2)
			throw new IllegalArgumentException("Buildtarget is invalid.");
		String buildtarget = rets[1];

		String[] buildDirs = getBuildDir(Integer.parseInt(buildtarget));
		for (Object key : json.keySet()) {
			String manifestKeyName = key.toString();
			if (manifestKeyName.matches("textures|audio|other")) {

				JSONArray arry = (JSONArray) json.get(manifestKeyName);
				for (Object fileName : arry) {
					final String filePattern = fileName.toString();
                    final ArrayList<String> pathList = recursiveSearch(baseDir, filePattern);

					for (String path : pathList) {
                        debug("ManifestCopy: " + path);
						for (String buildDir : buildDirs) {

							// If the directory is textures and endsWith
							// "android"
							boolean isAndroidTextures = manifestKeyName.equals("textures")
									&& buildDir.endsWith("android");

							File destFile = new File(new File(baseDir, buildDir), path);

							copy(new File(baseDir, path), destFile, isAndroidTextures);
						}
					}
				}
			}
		}
	}

	private static void copy(File sourceFile, File destFile,
			boolean isAndroidTextures) throws Exception {
        debug("copy from " + sourceFile.getAbsolutePath() + " to " +  destFile.getAbsolutePath());

		mkdirs(destFile.getParentFile());

		if (!isChangeFile(sourceFile, destFile, isAndroidTextures)) {
			debug("no change, skipped");
			return;
		}

		if (!isImageFile(sourceFile.getAbsolutePath()) || !isAndroidTextures) {
			copyFile(sourceFile, destFile);
			return;
		}

		Image img = new ImageIcon(sourceFile.getAbsolutePath()).getImage();
		int resize = getResize(img.getHeight(null), img.getWidth(null));
		if (resize == -1) {
			debug("not resize");
			copyFile(sourceFile, destFile);
			return;
		}

		// for Android resize
		resize(sourceFile, destFile, resize);
	}

	private static void resize(File sourceFile, File destFile, int resize)
			throws IOException {
		String suffix = getSuffix(sourceFile.getName());
		BufferedImage image = getBufferedImage(sourceFile);
		BufferedImage resizeImg = new BufferedImage(resize, resize, (suffix.matches("jpg|jpeg") ? image.getType() : BufferedImage.TYPE_4BYTE_ABGR));
		resizeImg.getGraphics().drawImage(
						image.getScaledInstance(resize, resize,
								Image.SCALE_AREA_AVERAGING), 0, 0, resize,
						resize, null);

		ImageIO.write(resizeImg, suffix, destFile);
		// copy timestamp
		destFile.setLastModified(sourceFile.lastModified());
		debug("resize : " + destFile.getAbsolutePath());
	}

	private static boolean isChangeFile(File sourceFile, File destFile,
			boolean isResize) {

		if (!destFile.exists()) {
			return true;
		}

		if (sourceFile.lastModified() != destFile.lastModified()) {
			return true;
		}

		// Not android resize and file size is different.
		if (!isResize && (sourceFile.length() != destFile.length())) {
			return true;
		}

		return false;
	}

	private static int getResize(int w, int h) {
		debug("img size width=" + w + ", heigh=" + h);
		if (w == h && (w & (w - 1)) == 0) {
			return -1;
		}
		int max = 0;
		int newd = 0;
		if (w > h) {
			max = w;
		} else {
			max = h;
		}

		if (max <= 32) {
			newd = 32;
		} else if (max <= 64) {
			newd = 64;
		} else if (max <= 128) {
			newd = 128;
		} else if (max <= 256) {
			newd = 256;
		} else if (max <= 512) {
			newd = 512;
		} else {
			newd = 1024;
		}
		debug("isNeedResize : new size = " + newd);
		return newd;
	}

	private static void copyFile(File srcFile, File destFile)
			throws IOException {

		FileChannel srcChannel = new FileInputStream(srcFile).getChannel();
		FileChannel destChannel = new FileOutputStream(destFile).getChannel();
		try {
			srcChannel.transferTo(0, srcChannel.size(), destChannel);
        }
        catch(Exception e) {
            System.out.println("ManifestCopy error: " + e.toString());
			e.printStackTrace();
		} finally {
			srcChannel.close();
			destChannel.close();

			// copy timestamp
			destFile.setLastModified(srcFile.lastModified());
		}
	}

	private static String getSuffix(String fileName) {
		if (fileName == null)
			return null;
		int point = fileName.lastIndexOf(".");
		if (point != -1) {
			return fileName.substring(point + 1);
		}
		return fileName;
	}

	private static BufferedImage getBufferedImage(File imageFile) {
		BufferedImage bimage = null;
		try {
			FileInputStream fis = new FileInputStream(imageFile);
			bimage = ImageIO.read(fis);
			fis.close();
		} catch (Exception e) {
			System.out.println("ManifestCopy error: use TYPE_INT_ARGB " + e.toString());

			Image img = new ImageIcon(imageFile.getAbsolutePath()).getImage();
			bimage = new BufferedImage(img.getWidth(null), img.getHeight(null),
					BufferedImage.TYPE_INT_ARGB);
		}
		return bimage;
	}

	private static boolean isImageFile(String name) {
		return name.matches(".*\\.(jpg|jpeg|gif|png)");
	}

	private static void mkdirs(File dir) {
		if (!dir.exists()) {
			boolean b = dir.mkdirs();
			if (b) {
				debug("mkdir " + dir.getAbsolutePath());
			} else {
				throw new RuntimeException("Could not mkdirs. "
						+ dir.getAbsolutePath());
			}
		}
	}

	private static String[] getBuildDir(int buildtarget) {
		switch (buildtarget) {
		case DEVICE_iOS:
			return new String[] { "build/ios" };
		case DEVICE_Android:
			return new String[] { "build/android" };
		case DEVICE_Flash:
			return new String[] { "build" };
		default:
			return new String[] { "build", "build/ios", "build/android" };
		}
	}

	private static String readFile(File path) throws IOException {
		StringBuffer buff = new StringBuffer();
		BufferedReader bufferReader = new BufferedReader(new InputStreamReader(
				new FileInputStream(path)));

		String str = "";
		while ((str = bufferReader.readLine()) != null) {
			buff.append(str);
		}
		bufferReader.close();
		return buff.toString();
	}
	private static ArrayList<String> recursiveSearch(final String baseDir, final String pathPattern) throws Exception  {
        ArrayList<String> list = new ArrayList<String>();

        ProcessBuilder pb = new ProcessBuilder("node", globCommand, baseDir, pathPattern);
		pb.redirectErrorStream(true);

		Process p = pb.start();

		InputStream childStdout = p.getInputStream();
		BufferedReader br = new BufferedReader(new InputStreamReader(childStdout));

		for(;;) {
			String line = br.readLine();
			if(line == null) {
				break;
			}
            list.add(line);
		}
		if(p.waitFor() != 0) {
            System.out.println("ManifestCopy error: glob expanding failed for " + pathPattern);
            return list;
        }
        return list;
    }
}
