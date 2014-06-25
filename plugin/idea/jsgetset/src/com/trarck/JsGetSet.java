package com.trarck;

import com.intellij.openapi.actionSystem.AnAction;
import com.intellij.openapi.actionSystem.AnActionEvent;
import com.intellij.openapi.actionSystem.PlatformDataKeys;
import com.intellij.openapi.application.ApplicationManager;
import com.intellij.openapi.editor.Document;
import com.intellij.openapi.editor.Editor;
import com.intellij.openapi.editor.SelectionModel;
import com.intellij.openapi.editor.VisualPosition;
import com.intellij.openapi.project.Project;

/**
 * Created with IntelliJ IDEA.
 * User: trarck
 * Date: 12-8-25
 * Time: 下午8:29
 * To change this template use File | Settings | File Templates.
 */
public class JsGetSet extends AnAction {

    private String tab="    ";
    private String prePad="";

    public void actionPerformed(final AnActionEvent event) {
//        Project project = event.getData(PlatformDataKeys.PROJECT);
        ApplicationManager.getApplication().runWriteAction(new Runnable() {
            public void run() {
                Editor editor = event.getData(PlatformDataKeys.EDITOR);
                SelectionModel selectionModel = editor.getSelectionModel();
                boolean hasSelection = selectionModel.hasSelection();
                Document document = editor.getDocument();
                if (hasSelection) {
                    VisualPosition startPosition=selectionModel.getSelectionStartPosition();

//                    System.out.println("line="+startPosition.getLine());
//                    System.out.println("colmun="+startPosition.getColumn());

                    prePad=padRight("",startPosition.getColumn());

                    int offsetStart   = selectionModel.getSelectionStart();
                    int offsetEnd     = selectionModel.getSelectionEnd();
                    CharSequence editorText = document.getCharsSequence();
                    String selectedText     = getSubString(editorText, offsetStart, offsetEnd);
//                    System.out.println(selectedText);
//                    System.out.print(selectedText.split(","));
                    document.replaceString(offsetStart,offsetEnd,createGetSet(selectedText.split(",")));
                }
            }
        });
//        String txt= Messages.showInputDialog(project, "What is your name ddd?", "Input your name", Messages.getQuestionIcon());
//        Messages.showMessageDialog(project, "Hello, " + txt + "!\n I am glad to see you.", "Information", Messages.getInformationIcon());getInformationIcon
    }
    public static String getSubString(CharSequence haystack, int offsetStart, int offsetEnd) {
        if (haystack.length() == 0) return null;

        return haystack.subSequence(offsetStart, offsetEnd).toString();
    }

    /**
     * 生成多个属性
     * @param props
     * @return
     */
    public String createGetSet(String[] props){
        String out="";
        int l=props.length;
        for(int i=0;i<l;i++){
            out+=createGetSet(props[i]);
        }
        return out;
    }

    /**
     * 生成单个属性
     * @param propName
     * @return
     */
    public String createGetSet(String propName){
        String out="";
        String caseAdjusted=ucfirst(propName);
        String lVarName = '_' + propName;

        String setterFn="function("+propName+") {\n"+prePad+tab+"this."+lVarName+" = "+propName+";\n"+prePad+tab+"return this;\n"+prePad+"}";
        out+="set"+caseAdjusted+":"+setterFn+",\n"+prePad;

        String getterFn="function() {\n"+prePad+tab+"return this."+lVarName+";\n"+prePad+"}";
        out+="get"+caseAdjusted+":"+getterFn+",\n"+prePad;
        return out;
    }

    public String ucfirst (String str) {
        return str.substring(0,1).toUpperCase() + str.substring(1);
    }
    public static String padRight(String s, int n) {
        return String.format("%1$-" + n + "s", s);
    }

    public static String padLeft(String s, int n) {
        return String.format("%1$" + n + "s", s);
    }

}
