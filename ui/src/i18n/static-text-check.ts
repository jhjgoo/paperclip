import ts from "typescript";

const VISIBLE_ATTRIBUTES = new Set(["alt", "placeholder", "title", "aria-label", "aria-description"]);

function diagnostic(fileName: string, sourceFile: ts.SourceFile, node: ts.Node, message: string, value: string) {
  const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
  return `${fileName}:${line + 1} ${message}: ${value}`;
}

function textValue(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export function checkStaticText(source: string, fileName: string): string[] {
  const sourceFile = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const diagnostics: string[] = [];

  function visit(node: ts.Node): void {
    if (ts.isJsxElement(node)) {
      node.children.forEach(visit);
      node.openingElement.attributes.properties.forEach(visit);
      return;
    }

    if (ts.isJsxText(node)) {
      const value = textValue(node.getText(sourceFile));
      if (value) {
        diagnostics.push(diagnostic(fileName, sourceFile, node, "JSX text must use i18n", value));
      }
    }

    if (ts.isJsxAttribute(node)) {
      const name = node.name.getText(sourceFile);
      const initializer = node.initializer;
      if (VISIBLE_ATTRIBUTES.has(name) && initializer && ts.isStringLiteral(initializer)) {
        diagnostics.push(diagnostic(fileName, sourceFile, node, `${name} must use i18n`, initializer.text));
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return diagnostics;
}
