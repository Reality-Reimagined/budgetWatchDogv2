import os
import logging

TEMPLATE_PATH = "templates/report_template.md"

def generate_markdown_report(data: dict, graphs: list, tables: list):
    """ Generate a Markdown report from the template """
    try:
        # Load template
        with open(TEMPLATE_PATH, "r") as template_file:
            report_template = template_file.read()

        # Generate Graph Markdown Embeds
        graph_md_links = "\n".join([f"![{os.path.basename(graph)}]({graph})" for graph in graphs])

        # Format Tables into Markdown
        table_md = "\n".join([
            f"| {row['Fiscal Year']} | {row['Revenue']} | {row['Expenses']} | {row['Surplus/Deficit']} |"
            for row in tables
        ])

        # Fill Template Placeholders
        filled_report = report_template.format(
            report_title=data["report_title"],
            report_content=data["report_content"],
            user_name=data["user_name"],
            company_email=data["company_email"],
            graph_paths=graph_md_links,
            table_data=table_md
        )

        # Save Generated Report
        report_file = os.path.join("reports", f"{data['report_title'].replace(' ', '_')}.md")
        os.makedirs(os.path.dirname(report_file), exist_ok=True)
        with open(report_file, "w") as output_file:
            output_file.write(filled_report)

        logging.info(f"Generated report: {report_file}")
        return report_file

    except Exception as e:
        logging.error(f"Error generating Markdown report: {str(e)}")
        raise Exception("Report generation failed.")

# import os

# TEMPLATE_PATH = "templates/report_template.md"

# def generate_markdown_report(data: dict, graphs: list, tables: list):
#     """ Generate a Markdown report from the template """
#     try:
#         # Load template
#         with open(TEMPLATE_PATH, "r") as template_file:
#             report_template = template_file.read()

#         # Generate Graph Markdown Embeds
#         graph_md_links = "\n".join([f"![{os.path.basename(graph)}]({graph})" for graph in graphs])

#         # Format Tables into Markdown
#         table_md = "\n".join([
#             f"| {row['Fiscal Year']} | {row['Revenue']} | {row['Expenses']} | {row['Surplus/Deficit']} |"
#             for row in tables
#         ])
        
#         # Fill Template Placeholders
#         filled_report = report_template.format(
#             report_title=data["report_title"],
#             report_content=data["report_content"],
#             user_name=data["user_name"],
#             company_email=data["company_email"],
#             graph_paths=graph_md_links,
#             table_data=table_md
#         )

#         # Save Generated Report
#         report_file = os.path.join("reports", f"{data['report_title'].replace(' ', '_')}.md")
#         with open(report_file, "w") as output_file:
#             output_file.write(filled_report)

#         print(f"Generated report: {report_file}")
#         return report_file

#     except Exception as e:
#         print(f"Error generating Markdown report: {e}")
#         raise Exception("Report generation failed.")
